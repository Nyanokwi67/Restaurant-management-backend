import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
  });
  
  // Add global prefix '/api'
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('API routes available at http://localhost:3000/api');
}
bootstrap();