import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {MailerService} from "@nestjs-modules/mailer";
import * as uuid from "uuid"
import * as path from "path"
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
              private mailerService: MailerService,) {
  }

  async createToken() {
    const gen = await this.generateToken()
    await this.sendConfirmLetter(process.env.MAIL_FOR_TOKEN, gen.token, gen.id)
    return {message: "token has been sent on your email"}
  }

  private async generateToken() {
    const id = uuid.v4();
    const saltRounds = "jwt-token-auth"
    const salt = await bcrypt.genSalt(saltRounds);
    const shift = await bcrypt.hash(id, salt);
    const payload = {id, shift: shift, salt, expire: Date.now() + 86400000}
    return {token: this.jwtService.sign(payload), id}
  }

  private async sendConfirmLetter(email: string, token: string, id: any) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Подтверждение регистрации',
        template: path.join(__dirname, '/../templates', 'accessToken'),
        context: {
          token, id
        },
      })
      .catch((e) => {
        console.log(e)
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
    return token
  }
}
