import { Personalization } from 'mailersend/lib/modules/Email.module';

export interface ErrorResponse {
  message?: string;
  [key: string]: any; // This allows for other properties
}

export interface PingResponse {
  message: string;
  timestamp: string;
}

export interface NotificationRequest {
  recipients: string[];
}

export interface EmailNotificationRequest extends NotificationRequest {
  subject: string;
  templateId: string;
  templateData: Personalization[];
}

export interface NotificationService {
  send(request: NotificationRequest): Promise<void>;
}

export interface JWTUser{
  id: number;
  email: string;
  verified: boolean;
}
