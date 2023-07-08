import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {CreateGenreDto} from "./dto/create-genre.dto";
import {GenreService} from "./genre.service";
import {ChangeNameDto} from "./dto/change-name.dto";

@Controller('genre')
export class GenreController {

  constructor(private genreService: GenreService) {
  }

  @Post('')
  create(@Body() dto: CreateGenreDto) {
    return this.genreService.create(dto)
  }

  @Post('/change-name')
  changeName(@Body() dto: ChangeNameDto) {
    return this.genreService.changeName(dto)
  }

  @Get('/by-book-id/:id')
  getAllByBookId(@Param('id') id: number) {
    return this.genreService.getAllByBookId(id)
  }

  @Get('')
  getAll() {
    return this.genreService.getAll()
  }

  @Get('/by-id/:id')
  getOneById(@Param('id') id: number) {
    return this.genreService.getOneById(id)
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: number) {
    return this.genreService.delete(id)
  }
}
