import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email_notification.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class NotificationModule {}
