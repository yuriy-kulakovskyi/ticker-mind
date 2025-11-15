import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter } from '@shared/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.use(cookieParser());
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new AllExceptionsFilter(),
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
