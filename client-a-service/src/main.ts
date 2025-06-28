import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
  console.log(' Client A Kafka consumer microservice is running on 3000');
}
bootstrap();
