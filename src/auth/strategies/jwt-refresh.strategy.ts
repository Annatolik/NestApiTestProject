import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const secretKey = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secretKey) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    
    const refreshToken = authHeader.split(' ')[1];
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    
    try {
      const user = await this.userService.findOne(payload.sub);
      
      // Verify that the refresh token matches the one stored for the user
      if (!user.refreshToken || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      throw new UnauthorizedException('User not found or refresh token invalid');
    }
  }
}