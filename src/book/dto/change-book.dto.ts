import {IsArray, IsBoolean, IsNumber, IsString, Length, Min} from "class-validator";

export class ChangeBookDto {

  @IsNumber({}, {message: "id должно быть числом"})
  id: number;

  @Length(4, 100, {message: "Длина названия от 4 до 100 символов"})
  name: string;

  @IsNumber({}, {message: "price должно быть числом"})
  @Min(0.5, {message: "price минимум 0.5"})
  price: number;

  @IsNumber({}, {message: "discount_price должно быть числом"})
  @Min(-1, {message: "discount_price минимум -1"})
  discount_price: number;

  @Length(60, 320, {message: "description от 60 до 320 символов"})
  description: string;

  @Length(60, 420, {message: "beginning_book от 60 до 420 символов"})
  beginning_book: string;

  @IsBoolean({message: "visibility имеет тип boolean"})
  visibility: boolean;

  @IsString({message: "genreIds должно быть массивом чисел"})
  genreIds: string
}