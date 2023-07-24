import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getMailConfig} from "../configs/mail.config";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET_KEY',
    }),
  ]
})
export class AuthModule {}
