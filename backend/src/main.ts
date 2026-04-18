import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Prefix toàn bộ API với /api
  app.setGlobalPrefix('api');

  // ✅ Bật CORS để Frontend (React) gọi được API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });

  // ✅ Global exception filter — trả lỗi nhất quán
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Validation toàn cục — tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger UI tại http://localhost:3000/api-docs
  const config = new DocumentBuilder()
    .setTitle('Student Management API')
    .setDescription('API quản lý sinh viên - NestJS + TypeORM + PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend running at: http://localhost:${port}`);
  console.log(`📚 Swagger UI at:      http://localhost:${port}/api-docs`);
}

bootstrap();
