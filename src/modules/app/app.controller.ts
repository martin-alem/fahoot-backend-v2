import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PingResponse } from '../../utils/interfaces';
import Result from '../../utils/result';
import { handleResult } from '../../utils/helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(): PingResponse {
    const result = this.appService.ping();
    return handleResult<PingResponse>(result)
  }
}
