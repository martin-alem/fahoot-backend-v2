import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { SharedModule } from '../shared/shared.module';
import { NotificationModule } from '../notification/notification.module';
import { APIKeyMiddleware } from '../../middleware/api_key.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule, NotificationModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(APIKeyMiddleware).forRoutes(UserController);
  }
}
