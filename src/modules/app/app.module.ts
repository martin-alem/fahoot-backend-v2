import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from '../notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        PORT: Joi.number().default(8080),
        FRONTEND_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        CLIENT_API_KEY: Joi.string().required(),
        VERIFY_EMAIL_URL: Joi.string().required(),
        PASSWORD_RESET_URL: Joi.string().required(),
        GOOGLE_CLIENT_KEY: Joi.string().required(),
        GOOGLE_SECRET_KEY: Joi.string().required(),
        MAILER_SEND_TOKEN: Joi.string().required(),
        MAILER_SEND_EMAIL: Joi.string().required(),
        WELCOME_EMAIL_TEMPLATE_ID: Joi.string().required(),
        SPACES_KEY: Joi.string().required(),
        SPACES_SECRET: Joi.string().required(),
        SPACES_BUCKET: Joi.string().required(),
        SPACES_REGION: Joi.string().required(),
        SPACES_ENDPOINT: Joi.string().required(),
      }),
    }),TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported here
      inject: [ConfigService], // Inject ConfigService to use in the factory
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
    }), NotificationModule],
  controllers: [AppController],
  providers: [AppService,     {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },],
})
export class AppModule {
}
