import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SharedService } from '../modules/shared/shared.service';
import { ACCESS_TOKEN_NAME } from '../utils/constant';
import { JWTUser } from '../utils/interfaces';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  private readonly sharedService: SharedService;

  constructor(sharedService: SharedService) {
    this.sharedService = sharedService;
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tokenCookie = req.cookies[ACCESS_TOKEN_NAME];
    if (!tokenCookie) {
      throw new UnauthorizedException(
        'Unauthorized access: Please log in to continue.',
      );
    }

    const decodedToken =
      await this.sharedService.validateToken<JWTUser>(tokenCookie);

    if (!decodedToken.isSuccess()) {
      throw new UnauthorizedException(
        'Invalid or expired token: Please log in again.',
      );
    }

    next();
  }
}
