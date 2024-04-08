import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailNotificationRequest,
  NotificationService,
} from '../../utils/interfaces';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailNotificationService implements NotificationService {
  private readonly mailerSend: MailerSend;
  private readonly sender: Sender;
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.mailerSend = new MailerSend({
      apiKey: this.configService.get<string>('MAILER_SEND_TOKEN'),
    });
    this.sender = new Sender(
      this.configService.get<string>('MAILER_SEND_EMAIL'),
      'Fahoot',
    );
  }
  async send(request: EmailNotificationRequest): Promise<void> {
    const recipients = request.recipients.map(
      (recipient) => new Recipient(recipient),
    );
    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(recipients)
      .setReplyTo(this.sender)
      .setSubject(request.subject)
      .setTemplateId(request.templateId)
      .setPersonalization(request.templateData);

    await this.mailerSend.email.send(emailParams);
    return Promise.resolve(undefined);
  }
}
