import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from './shared.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockedToken'),
            verify: jest.fn().mockImplementation(() => ({ userId: 1 })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              switch (key) {
                case 'JWT_TOKEN_AUDIENCE':
                  return 'testAudience';
                case 'JWT_TOKEN_ISSUER':
                  return 'testIssuer';
                case 'JWT_SECRET':
                  return 'testSecret';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signToken', () => {
    it('should sign a token successfully', async () => {
      const result = await service.signToken({ userId: 1 }, 3600);
      expect(result.getData()).toEqual('mockedToken');
      expect(result.isSuccess()).toBeTruthy();
    });
  });

  describe('validateToken', () => {
    it('should validate a token successfully', async () => {
      const result = await service.validateToken('mockedToken');
      expect(result.getData()).toEqual({ userId: 1 });
      expect(result.isSuccess()).toBeTruthy();
    });
  });

  describe('hash', () => {
    it('should hash data successfully', async () => {
      // Mock bcrypt hash inside the service if necessary
      const result = await service.hash('password');
      expect(result.isSuccess()).toBeTruthy();
      // Additional assertions on the result can be added as needed
    });
  });

  describe('compare', () => {
    it('should compare hashed data successfully', async () => {
      // Mock bcrypt compare inside the service if necessary
      const result = await service.compare('password', 'hashedPassword');
      expect(result.isSuccess()).toBeTruthy();
      // Additional assertions on the result can be added as needed
    });
  });

  describe('generateToken', () => {
    it('should generate a token successfully', async () => {
      const result = await service.generateToken({ userId: 1 });
      expect(result.getData()).toEqual('mockedToken');
      expect(result.isSuccess()).toBeTruthy();
    });
  });
});
