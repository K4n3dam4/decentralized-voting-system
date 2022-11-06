import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [ctx.getHandler(), ctx.getClass()]);

    if (!requiredRoles) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
