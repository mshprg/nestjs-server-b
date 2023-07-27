import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]
      const id = authHeader.split(' ')[2]

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: 'Пользователь не авторизован'})
      }

      //const tkVer = this.jwtService.verify(token)
      const tk: any = this.jwtService.decode(token)
      const res = bcrypt.compareSync(id, tk.shift)
      return (tk.id === id && res && tk.expire >= Date.now());
    } catch (e) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    }
  }

}