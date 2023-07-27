import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CreateGenreDto} from "./dto/create-genre.dto";
import {GenreService} from "./genre.service";
import {ChangeNameDto} from "./dto/change-name.dto";
import {AuthGuard} from "../auth/auth.guard";

@Controller('genre')
export class GenreController {

  constructor(private genreService: GenreService) {
  }

  @UseGuards(AuthGuard)
  @Post('')
  create(@Body() dto: CreateGenreDto) {
    return this.genreService.create(dto)
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get('/by-id/:id')
  getOneById(@Param('id') id: number) {
    return this.genreService.getOneById(id)
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: number) {
    return this.genreService.delete(id)
  }
}
