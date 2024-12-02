import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokekenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private configService: ConfigService
  ) {}

  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);
    const expires = new Date();
    expires.setMilliseconds(
      expires.getTime() + parseInt(this.configService.get('JWT_EXPIRATION_MS'))
    );

    const tokenPayload: TokekenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
    return user;
  }

  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
