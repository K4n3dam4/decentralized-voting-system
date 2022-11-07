import { ValidationPipe } from '@nestjs/common';

const { NODE_ENV, PORT, GLOBAL_PREFIX, JWT_SECRET, SECRET, SALT, ALCHEMY_API, ALCHEMY_API_KEY, ADMIN_PK, ELECTION } =
  process.env;

export const configuration = () => ({
  environment: NODE_ENV,
  port: parseInt(PORT || '3000', 10),
  globalPrefix: GLOBAL_PREFIX || 'api',
  validationPipe: new ValidationPipe({ whitelist: true }),
  jwtSecret: JWT_SECRET,
  jwtExpiration: '15m',
  secret: SECRET,
  salt: SALT,
  // Blockchain
  alchemyAPI: ALCHEMY_API,
  alchemyAPIKey: ALCHEMY_API_KEY,
  // Blockchain - Admin
  adminPk: ADMIN_PK,
  // Blockchain - Contracts
  contractElection: ELECTION,
});
