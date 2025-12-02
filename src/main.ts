import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Miriam\'s Restaurant Management API')
    .setDescription('Complete POS system for managing orders, tables, menu, staff, and expenses')
    .setVersion('1.0')
    .addTag('Authentication', 'Login and authentication endpoints')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Menu Items', 'Menu management')
    .addTag('Tables', 'Table management')
    .addTag('Orders', 'Order management')
    .addTag('Expenses', 'Expense tracking and approval')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for reference
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📖 Swagger documentation: http://localhost:3000/api');
}
bootstrap();