import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/decorator/customize';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // không yêu cầu role cụ thể
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || !requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException('Bạn không có quyền truy cập chức năng này!');
    }

    return true;
  }
}
