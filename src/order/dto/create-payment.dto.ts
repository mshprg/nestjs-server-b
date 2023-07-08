import {IsNumber, Min} from "class-validator";

export class CreatePaymentDto {

  @IsNumber({}, {message: "price должно быть числом"})
  @Min(0, {message: "price не меньше нуля"})
  price: number;

}