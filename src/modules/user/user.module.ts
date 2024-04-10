import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { SharedModule } from '../shared/shared.module';
import { NotificationModule } from '../notification/notification.module';
import { APIKeyMiddleware } from '../../middleware/api_key.middleware';
import { AccessTokenMiddleware } from '../../middleware/access_token.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule, NotificationModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(APIKeyMiddleware).forRoutes(UserController);
    consumer
      .apply(AccessTokenMiddleware)
      .exclude(
        { path: '/user/verify_email', method: RequestMethod.GET },
        { path: '/user/password_reset_request', method: RequestMethod.POST },
        { path: '/user/update_password', method: RequestMethod.PATCH },
      )
      .forRoutes(
        { path: '/user/:id', method: RequestMethod.GET },
        { path: '/user/:id', method: RequestMethod.DELETE },
        { path: '/user/switch_account_type/:id', method: RequestMethod.PATCH },
        { path: '/user/email/:id', method: RequestMethod.PATCH },
        { path: '/user/info/:id', method: RequestMethod.PATCH },
      );
  }
}
