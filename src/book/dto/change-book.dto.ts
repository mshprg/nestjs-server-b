import {IsArray, IsBoolean, IsNumber, Length, Min} from "class-validator";

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

  @Length(60, 340, {message: "description от 60 до 340 символов"})
  description: string;

  @Length(60, 550, {message: "beginning_book от 60 до 550 символов"})
  beginning_book: string;

  @IsBoolean({message: "visibility имеет тип boolean"})
  visibility: boolean;

  @IsArray({message: "genreIds должно быть массивом числел"})
  genreIds: number[]
}