import {IsNumber} from "class-validator";

export class CreateBasketItemDto {

  basketToken: number;

  @IsNumber({}, {message: "bookId должно быть числом"})
  bookId: number;
}