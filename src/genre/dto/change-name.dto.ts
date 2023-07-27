import {IsNumber, Length} from "class-validator";

export class ChangeNameDto {

  @IsNumber({}, {message: "id должно быть числом"})
  id: number;

  @Length(4, 30, {message: "Имя не менне 4 и не более 30 символов"})
  name: string;
}