import { Injectable } from '@nestjs/common';
import { PingResponse } from '../../utils/interfaces';
import Result from '../../utils/result';

@Injectable()
export class AppService {
  ping(): Result<PingResponse> {
    return new Result<PingResponse>(
      true,
      { message: 'server up and running', timestamp: new Date().toISOString() },
      null,
      200,
    );
  }
}
