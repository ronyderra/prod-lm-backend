import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Location Management API')
      .setDescription('A RESTful API for managing locations with geocoding capabilities using OpenStreetMap')
      .setVersion('1.0.0')
      .addTag('locations', 'Location management endpoints')
      .addTag('osm', 'OpenStreetMap geocoding endpoints')
      .addTag('health', 'Health check endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
