import {Length} from "class-validator";

export class CreateGenreDto {

  @Length(4, 20, {message: "Имя не менне 4 и не более 20 символов"})
  name: string;
}