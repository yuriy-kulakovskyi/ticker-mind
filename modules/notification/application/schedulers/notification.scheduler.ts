import { Injectable, Logger } from "@nestjs/common";
import { GetNotificationsUseCase } from "../usecases/get-notifications.usecase";
import { Cron } from "@nestjs/schedule";
import { GetAllSubscribersUseCase } from "@subscriber/application/usecases/get-all-subscribers.usecase";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { SendMailService } from "@shared/mailer/mailer.service";
import { INewsDataApiResponse, INewsArticle } from "@notification/domain/interfaces/news-api-response.interface";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);
  private readonly MAX_ARTICLES = 5;
  private readonly API_TIMEOUT = 10000;
  private readonly REQUEST_DELAY = 1000;

  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getAllSubscribersUseCase: GetAllSubscribersUseCase,
    private readonly httpService: HttpService,
    private readonly mailerService: SendMailService
  ) {}

  // Every day from Monday to Saturday at 10:00 AM
  @Cron("0 0 10 * * 1-6")
  async handleCron() {
    this.logger.log('Starting notification scheduler...');
    
    try {
      const subscribers = await this.getAllSubscribersUseCase.execute();
      await this.processSubscribers(subscribers);
      this.logger.log('Notification scheduler completed.');
    } catch (error) {
      this.logger.error('Error in notification scheduler:', error);
    }
  }

  private async processSubscribers(subscribers: Subscriber[]): Promise<void> {
    for (const subscriber of subscribers) {
      try {
        await this.processSubscriberNotifications(subscriber);
      } catch (error) {
        this.logger.error(`Error processing notifications for subscriber ${subscriber.id}:`, error);
      }
    }
  }

  private async processSubscriberNotifications(subscriber: Subscriber): Promise<void> {
    const notifications = await this.getNotificationsUseCase.execute(subscriber.id);
    
    for (const notification of notifications) {
      try {
        await this.processNotification(notification, subscriber);
        await this.delay(this.REQUEST_DELAY);
      } catch (error) {
        this.handleNotificationError(error, notification.id);
        
        // Stop processing if rate limited
        if (this.isRateLimitError(error)) {
          return;
        }
      }
    }
  }

  private async processNotification(
    notification: NotificationEntity, 
    subscriber: Subscriber
  ): Promise<void> {
    const articles = await this.fetchNewsArticles(notification);
    
    if (articles.length === 0) {
      this.logger.log(`No news articles found for notification ${notification.id}`);
      return;
    }

    this.logger.log(`Fetched ${articles.length} news articles for notification ${notification.id}`);
    await this.sendNewsEmail(subscriber, notification, articles);
  }

  private async fetchNewsArticles(notification: NotificationEntity): Promise<INewsArticle[]> {
    const tickersQuery = this.buildTickersQuery(notification.tickers);
    const apiUrl = this.buildApiUrl(tickersQuery);
    
    this.logger.log(`Fetching news with query: "${tickersQuery}"`);
    this.logger.log(`API URL: ${apiUrl.replace(process.env.NEWSDATA_API_KEY || '', 'API_KEY')}`);
    
    const { data } = await firstValueFrom(
      this.httpService.get<INewsDataApiResponse>(apiUrl, {
        timeout: this.API_TIMEOUT,
      })
    );
    
    const articles = data?.results?.slice(0, this.MAX_ARTICLES) || [];
    
    if (articles.length > 0) {
      this.logger.log(`Articles returned:`);
      articles.forEach((article, index) => {
        this.logger.log(`  ${index + 1}. "${article.title}"`);
      });
    }
    
    return articles;
  }

  private buildTickersQuery(tickers: string[]): string {
    return tickers.map(ticker => ticker.toLowerCase()).join(" OR ");
  }

  private buildApiUrl(tickersQuery: string): string {
    return `${process.env.NEWSDATA_API_URL}?apikey=${process.env.NEWSDATA_API_KEY}&qInMeta=${tickersQuery}`;
  }

  private async sendNewsEmail(
    subscriber: Subscriber,
    notification: NotificationEntity,
    articles: INewsArticle[]
  ): Promise<void> {
    const emailContent = this.buildEmailContent(articles);
    
    await this.mailerService.sendMail({
      to: subscriber.email,
      subject: notification.title,
      text: notification.message || 'Here are the latest news articles based on your notification settings.',
      html: this.buildEmailHtml(emailContent, notification.message),
    });
    
    this.logger.log(`Email sent to ${subscriber.email} for notification ${notification.id}`);
  }

  private buildEmailContent(articles: INewsArticle[]): string {
    return articles.map(article => this.buildArticleHtml(article)).join('');
  }

  private buildArticleHtml(article: INewsArticle): string {
    const publishDate = new Date(article.pubDate).toLocaleDateString();
    const imageHtml = article.image_url 
      ? `<img src="${article.image_url}" alt="${article.title}" style="max-width: 100%; height: auto; border-radius: 5px; margin-top: 10px;">` 
      : '';
    
    return `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <h3 style="margin-top: 0;">
          <a href="${article.link}" target="_blank" style="color: #0066cc; text-decoration: none;">
            ${article.title}
          </a>
        </h3>
        <p style="color: #333; line-height: 1.6;">${article.description}</p>
        <p style="color: #666; font-size: 12px; margin-bottom: 0;">
          📰 Source: ${article.source_name} | 📅 Published: ${publishDate}
        </p>
        ${imageHtml}
      </div>
    `;
  }

  private buildEmailHtml(content: string, message?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${message ? `<p style="color: #333;">${message}</p>` : ''}
        <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
          📈 Latest News
        </h2>
        ${content}
        <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>You're receiving this email because you subscribed to notifications from Ticker Mind.</p>
        </footer>
      </div>
    `;
  }

  private handleNotificationError(error: unknown, notificationId: string): void {
    if (!(error instanceof AxiosError)) {
      this.logger.error(`Unexpected error processing notification ${notificationId}:`, error);
      return;
    }

    if (error.code === 'ECONNRESET') {
      this.logger.warn(`Connection reset for notification ${notificationId}. API may be rate limiting.`);
    } else if (error.response?.status === 429) {
      this.logger.warn('Rate limit exceeded. Skipping remaining notifications.');
    } else {
      this.logger.error(`API error for notification ${notificationId}: ${error.message}`);
    }
  }

  private isRateLimitError(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 429;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}