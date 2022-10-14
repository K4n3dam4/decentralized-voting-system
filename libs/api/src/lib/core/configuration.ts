import { ValidationPipe } from '@nestjs/common';

export const configuration = () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  validationPipe: new ValidationPipe({ whitelist: true }),
  jwtSecret: process.env.JWT_SECRET,
  secret: process.env.SECRET,
  salt: process.env.SALT,
  // Blockchain
  alchemyAPI: process.env.ALCHEMY_API,
  alchemyAPIKey: process.env.ALCHEMY_API_KEY,
});
