import { ValidationPipe } from '@nestjs/common';

export const configuration = () => ({
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  validationPipe: new ValidationPipe({ whitelist: true }),
  jwtSecretVoter: process.env.JWT_SECRET_VOTER,
  jwtSecretAdmin: process.env.JWT_SECRET_ADMIN,
  secret: process.env.SECRET,
  salt: process.env.SALT,
  // Blockchain
  alchemyAPI: process.env.ALCHEMY_API,
  alchemyAPIKey: process.env.ALCHEMY_API_KEY,
  // Blockchain - Admin
  adminPk: process.env.ADMIN_PK,
  // Blockchain - Contracts
  contractElection: process.env.ELECTION,
});
