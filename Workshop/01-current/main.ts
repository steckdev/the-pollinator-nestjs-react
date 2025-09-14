import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../api/weather-services-api/src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_TITLE = 'Weather Service Api';
const APP_DESCRIPTION = 'Weather service api that provides weather information.';
const APP_VERSION = '1.0';
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 1000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.use(rateLimit({ windowMs: WINDOW_MS, max: MAX_REQUESTS }));
  const config = new DocumentBuilder().setTitle(APP_TITLE).setDescription(APP_DESCRIPTION).setVersion(APP_VERSION).build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

