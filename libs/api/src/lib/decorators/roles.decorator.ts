import { SetMetadata } from '@nestjs/common';

export const Roles = (...hasRoles: string[]) => SetMetadata('roles', hasRoles);
