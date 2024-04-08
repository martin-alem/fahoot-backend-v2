import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Result from '../../utils/result';
import { PingResponse } from '../../utils/interfaces';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockPingResponse = new Result<PingResponse>(
      true,
      { message: "server up and running", timestamp: new Date().toISOString() },
      null,
      200
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            ping: jest.fn(() => mockPingResponse), // Mock implementation of ping
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return a Result object with a message "server up and running"', async () => {
      const expectedResponse = {
        message: "server up and running",
        timestamp: expect.any(String)
      };

      const result = appController.ping();

      expect(result).toEqual(expectedResponse);
    });
  });
});
