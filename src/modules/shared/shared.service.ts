import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import Result from '../../utils/result';
import * as bcrypt from 'bcryptjs';
import { DEFAULT_SIGN_TOKEN_TTL } from '../../utils/constant';

@Injectable()
export class SharedService {
  private readonly configService: ConfigService;
  private readonly jwtService: JwtService;

  constructor(configService: ConfigService, jwtService: JwtService) {
    this.jwtService = jwtService;
    this.configService = configService;
  }

  public async signToken<T extends object>(
    entity: T,
    ttl: number = DEFAULT_SIGN_TOKEN_TTL,
  ): Promise<Result<string | null>> {
    const audience = this.configService.get<string>('JWT_TOKEN_AUDIENCE');
    const issuer = this.configService.get<string>('JWT_TOKEN_ISSUER');
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!audience || !issuer || !secret) {
      return new Result<string | null>(
        false,
        null,
        'JWT configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const token = await this.jwtService.signAsync(
        { ...entity },
        {
          audience: audience,
          issuer: issuer,
          secret: secret,
          expiresIn: ttl,
        },
      );

      return new Result<string>(true, token, null, HttpStatus.OK);
    } catch (error) {
      return new Result<string | null>(
        false,
        null,
        `Token signing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateToken<T extends object>(
    token: string,
  ): Promise<Result<T | null>> {
    const audience = this.configService.get<string>('JWT_TOKEN_AUDIENCE');
    const issuer = this.configService.get<string>('JWT_TOKEN_ISSUER');
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!audience || !issuer || !secret) {
      return new Result<T | null>(
        false,
        null,
        'JWT configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const decodedToken = this.jwtService.verify<T>(token, {
        audience,
        issuer,
        secret,
      });
      return new Result<T>(true, decodedToken, null, HttpStatus.OK);
    } catch (error) {
      // Handle specific JWT errors
      let message = 'Token validation failed';
      const statusCode = HttpStatus.UNAUTHORIZED;

      if (error instanceof TokenExpiredError) {
        message = 'Token has expired';
      } else if (error instanceof JsonWebTokenError) {
        message = 'Invalid token';
      }

      return new Result<T | null>(false, null, message, statusCode);
    }
  }

  public async hash(data: string): Promise<Result<string | null>> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data, salt);
      return new Result<string>(true, hash.toString(), null, HttpStatus.OK);
    } catch (error) {
      return new Result<string | null>(
        false,
        null,
        'unable to hash data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async compare(
    incomingData: string,
    hashedData: string,
  ): Promise<Result<boolean | null>> {
    try {
      const isMatch = await bcrypt.compare(incomingData, hashedData);
      return new Result<boolean>(true, isMatch, null, HttpStatus.OK);
    } catch (error) {
      return new Result<boolean | null>(
        false,
        false,
        'unable to compare data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async generateToken<T extends object>(
    entity: T,
    tokenTTL: number = DEFAULT_SIGN_TOKEN_TTL,
  ): Promise<Result<string | null>> {
    try {
      const token = await this.signToken<T>(entity, tokenTTL);
      const data = token.getData();
      if (!data)
        return new Result<null>(
          false,
          null,
          'Unable to sign token',
          HttpStatus.BAD_REQUEST,
        );

      return new Result<string>(true, data, null, HttpStatus.OK);
    } catch (error) {
      return new Result<string | null>(
        false,
        null,
        'error generating token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
