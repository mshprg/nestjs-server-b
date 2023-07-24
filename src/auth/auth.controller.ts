import {Controller, Get, Post, Query} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('/create-token')
  createToken() {
    return this.authService.createToken()
  }

  @Get('/')
  checkForAdmin(@Query('token') token: string, @Query('id') id: string) {
    return this.authService.checkForAdmin(token, id)
  }
}
