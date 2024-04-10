import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { NotificationModule } from '../notification/notification.module';
import { SharedModule } from '../shared/shared.module';
import { APIKeyMiddleware } from '../../middleware/api_key.middleware';
import { UserController } from '../user/user.controller';
import { AccessTokenMiddleware } from '../../middleware/access_token.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [NotificationModule, SharedModule, UserModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(APIKeyMiddleware).forRoutes(AuthenticationController);
  }
}