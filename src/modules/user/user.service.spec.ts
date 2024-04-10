import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { SharedService } from '../shared/shared.service';
import { EmailNotificationService } from '../notification/email_notification.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  const mockRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockSharedService = {
    hash: jest.fn(),
  };
  const mockEmailNotificationService = {
    send: jest.fn(),
  };
  const mockConfigService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
