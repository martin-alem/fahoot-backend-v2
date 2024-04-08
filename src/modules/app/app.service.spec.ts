import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Result from '../../utils/result';
import { PingResponse } from '../../utils/interfaces';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return a success Result object', async () => {
      const expectedResponse = {
        data: {
          message: "server up and running",
          timestamp: expect.any(String)
        },
        "error": null,
        "errorCode": 200,
        "success": true
      };

      const result = appService.ping();

      expect(result).toEqual(expectedResponse);
    });
  });
});
