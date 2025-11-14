import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IMailOptions } from '@shared/interfaces/mail.interface';

@Injectable()
export class SendMailService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  sendMail(data: IMailOptions) {
    const payload = {
      from: {
        email: "hello@demomailtrap.co",
        name: "Ticker Mind",
      },
      to: [
        {
          email: data.to,
        },
      ],
      subject: data.subject,
      text: data.text,
      html: data.html,
      category: "TickerMind Notifications",
    };

    return this.httpService.post(
      "https://send.api.mailtrap.io/api/send",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILTRAP_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    ).subscribe();
  }
}