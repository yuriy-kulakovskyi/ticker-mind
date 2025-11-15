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
      sender: {
        name: "Ticker Mind",
        email: process.env.BREVO_SENDER_EMAIL || "noreply@example.com",
      },
      to: [
        {
          email: data.to,
        },
      ],
      subject: data.subject,
      htmlContent: data.html || data.text,
    };

    return this.httpService.post(
      process.env.BREVO_API_URL || "",
      payload,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "accept": "application/json",
          "content-type": "application/json",
        },
      },
    ).subscribe();
  }
}