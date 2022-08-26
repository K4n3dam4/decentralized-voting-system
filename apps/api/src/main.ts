import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const environment = config.get('environment');
  const port = config.get('port');
  const globalPrefix = config.get('globalPrefix');

  app.useGlobalPipes(config.get('validationPipe'));
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);

  Logger.log(`👂 Listening at http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🏃 Running in ${environment}`);
}

bootstrap().catch((error) => Logger.error(error));
