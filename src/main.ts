import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
