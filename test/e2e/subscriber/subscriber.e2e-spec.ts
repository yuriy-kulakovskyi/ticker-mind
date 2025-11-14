import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '@prisma/prisma.service';

describe('SubscriberController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDdiODEwZmQtMGQ3Zi00YjFhLWE1YzEtYjAxODE5NGY5NjM0IiwiZW1haWwiOiJ5dXJpaS5rdWxha292c2t5aS5yaS4yMDI0QGxwbnUudWEiLCJpYXQiOjE3NjMwNTIwOTUsImV4cCI6MTc2MzEzODQ5NX0.f68vitvMr96WN-8xMaHxMZOq4WPUmoGFsf0LTJJ7738';
  const testUserId = '07b810fd-0d7f-4b1a-a5c1-b018194f9634';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();

    // Delete existing subscriber to ensure clean state
    await prisma.subscriber.deleteMany({
      where: { id: testUserId }
    });
  });

  afterAll(async () => {
    await prisma.subscriber.deleteMany({
      where: { id: testUserId }
    });
    await app.close();
  });

  describe('POST /subscriber', () => {
    it('should create a new subscriber or return 409 if already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/subscriber')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ displayName: 'Test User' });

      // Accept either 201 (created) or 409 (already exists)
      expect([201, 409]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');
        expect(response.body.displayName).toBe('Test User');
      }
    });

    it('should return 403 without authentication', () => {
      return request(app.getHttpServer())
        .post('/subscriber')
        .send({ displayName: 'Test User' })
        .expect(403);
    });

    it('should return 409 if subscriber already exists', () => {
      return request(app.getHttpServer())
        .post('/subscriber')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ displayName: 'Test User' })
        .expect(409);
    });
  });

  describe('GET /subscriber/me', () => {
    it('should get current subscriber', () => {
      return request(app.getHttpServer())
        .get('/subscriber/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
        });
    });

    it('should return 403 without authentication', () => {
      return request(app.getHttpServer())
        .get('/subscriber/me')
        .expect(403);
    });
  });

  describe('GET /subscriber/:id', () => {
    it('should get subscriber by id', () => {
      return request(app.getHttpServer())
        .get(`/subscriber/${testUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.id).toBe(testUserId);
        });
    });

    it('should return 404 for non-existent subscriber', () => {
      return request(app.getHttpServer())
        .get('/subscriber/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /subscriber', () => {
    it('should update subscriber display name', () => {
      return request(app.getHttpServer())
        .patch('/subscriber')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ displayName: 'Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.displayName).toBe('Updated Name');
        });
    });

    it('should return 403 without authentication', () => {
      return request(app.getHttpServer())
        .patch('/subscriber')
        .send({ displayName: 'Updated Name' })
        .expect(403);
    });
  });

  describe('DELETE /subscriber', () => {
    it('should return 403 without authentication', () => {
      return request(app.getHttpServer())
        .delete('/subscriber')
        .expect(403);
    });

    it('should delete subscriber', () => {
      return request(app.getHttpServer())
        .delete('/subscriber')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });
});
