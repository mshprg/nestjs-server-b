import {IsNumber, Length} from "class-validator";

export class ChangeNameDto {

  @IsNumber({}, {message: "id должно быть числом"})
  id: number;

  @Length(4, 20, {message: "Имя не менне 4 и не более 20 символов"})
  name: string;
}