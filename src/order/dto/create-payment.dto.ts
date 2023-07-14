import {IsEmail, IsNumber, IsString, Length, Min} from "class-validator";

export class CreatePaymentDto {

  @IsNumber({}, {message: "price должно быть числом"})
  @Min(0, {message: "price не меньше нуля"})
  price: number;

  @Length(2, 50, {message: "Имя от 2 до 50 символов"})
  name: string;

  @IsEmail({}, {message: "Неверный формат email"})
  email: string;

  @IsString({message: "Массив книг должен быть строкой"})
  bookIds: string;

}