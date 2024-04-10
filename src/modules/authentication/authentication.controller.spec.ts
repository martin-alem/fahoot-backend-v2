import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { SharedService } from '../shared/shared.service';
import { EmailNotificationService } from '../notification/email_notification.service';
import { ConfigService } from '@nestjs/config';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  const mockUserService = {};
  const mockSharedService = {
    hash: jest.fn(),
  };
  const mockEmailNotificationService = {
    send: jest.fn(),
  };
  const mockConfigService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: SharedService,
          useValue: mockSharedService,
        },
        {
          provide: EmailNotificationService,
          useValue: mockEmailNotificationService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
