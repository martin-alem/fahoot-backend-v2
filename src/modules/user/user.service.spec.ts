import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { SharedService } from '../shared/shared.service';
import { EmailNotificationService } from '../notification/email_notification.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let mockRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
  let mockSharedService= {
    hash: jest.fn()
  }
  let mockEmailNotificationService= {
    send: jest.fn()
  }
  let mockConfigService= {}



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue:mockRepository
        },
        {
          provide: SharedService,
          useValue: mockSharedService
        },
        {
          provide: EmailNotificationService,
          useValue: mockEmailNotificationService
        },
        {
          provide: ConfigService,
          useValue:mockConfigService
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
