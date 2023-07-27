import {Length} from "class-validator";

export class CreateGenreDto {

  @Length(4, 30, {message: "Имя не менне 4 и не более 30 символов"})
  name: string;
}