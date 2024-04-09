import { ForbiddenException, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class APIKeyMiddleware implements NestMiddleware {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const expectedApiKey = this.configService.get('CLIENT_API_KEY');

    if (!expectedApiKey) {
      throw new InternalServerErrorException('API key is not configured.');
    }

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ForbiddenException('No authorization token provided.');
    }

    // Typically, the Authorization header is formatted as "Bearer [token]"
    // Here, we split the header on spaces and get the token part
    const token = authorizationHeader.split(' ')[1];

    // Compare the provided token with the expected API key
    if (token !== expectedApiKey) {
      // If the tokens do not match, throw a ForbiddenException
      throw new ForbiddenException('Invalid API key.');
    }
    next();
  }
}

