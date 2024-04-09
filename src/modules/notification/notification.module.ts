import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email_notification.service';

@Module({
  imports: [],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class NotificationModule {}
