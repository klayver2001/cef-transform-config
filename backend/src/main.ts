import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir requisições do front-end Angular
  app.enableCors();

  // Define um prefixo global para a API
  app.setGlobalPrefix('api');

  // Usa o ValidationPipe globalmente para validar DTOs em todos os endpoints
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
    transform: true, // Transforma o payload para a instância do DTO
  }));

  await app.listen(3000);
}
bootstrap();