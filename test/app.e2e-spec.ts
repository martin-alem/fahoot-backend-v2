import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'server up and running');
        expect(res.body).toHaveProperty('timestamp');
        expect(new Date(res.body.timestamp)).toBeInstanceOf(Date); // This checks if 'timestamp' is a valid date
      });
  });
});
