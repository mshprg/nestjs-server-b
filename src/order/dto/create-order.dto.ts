import {IsEmail, IsString, Length} from "class-validator";

export class CreateOrderDto {

  @Length(2, 50, {message: "Имя от 2 до 50 символов"})
  name: string;

  @IsEmail({}, {message: "Неверный формат email"})
  email: string;

  @IsString({message: "Массив книг должен быть строкой"})
  bookIds: string;
}