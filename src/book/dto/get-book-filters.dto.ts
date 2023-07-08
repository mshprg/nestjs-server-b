import { IsNumber, IsString, Min } from "class-validator";

export class GetBookFiltersDto {

  @IsNumber({}, {message: "min_price должно быть числом"})
  @Min(0)
  min_price: number;

  @IsNumber({}, {message: "max_price должно быть числом"})
  max_price: number;

  @IsNumber({}, {message: "page должно быть числом"})
  @Min(1)
  page: number;

  @IsString({message: "Массив фильтров должен быть строкой"})
  genres: string;
}