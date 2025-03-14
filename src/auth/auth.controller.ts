import { 
    Controller, 
    Post, 
    Body, 
    HttpCode, 
    HttpStatus, 
    UseGuards,
    Request 
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto/login.dto';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    register(@Body() createUserDto: CreateUserDto) {
      return this.authService.register(createUserDto);
    }
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token' })
    refresh(@Request() req) {
      const userId = req.user.userId;
      const refreshToken = req.headers.authorization.split(' ')[1];
      return this.authService.refreshTokens(userId, refreshToken);
    }
  
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout' })
    logout(@Request() req) {
      const userId = req.user.userId;
      return this.authService.logout(userId);
    }
  }