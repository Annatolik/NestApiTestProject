import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    
    return {
      user: {
        id: user.id,
        email: user.email
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      const isPasswordValid = await user.comparePassword(loginDto.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      
      return {
        user: {
          id: user.id,
          email: user.email
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    try {
      const user = await this.userService.findOne(userId);
      
      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  async logout(userId: number) {
    await this.userService.setRefreshToken(userId, null);
    return { message: 'Logout successful' };
  }

  private async generateTokens(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);
    
    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userService.setRefreshToken(userId, refreshToken);
  }
}