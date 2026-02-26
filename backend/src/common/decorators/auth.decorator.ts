import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/auth.guard';

export function WithAuth() {
  return applyDecorators(UseGuards(JwtGuard));
}
