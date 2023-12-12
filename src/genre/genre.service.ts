import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Genre} from "./genre.model";
import {CreateGenreDto} from "./dto/create-genre.dto";
import {ChangeNameDto} from "./dto/change-name.dto";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {Op} from "sequelize";

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre,
              @InjectModel(BookGenre) private bookGenreRepository: typeof BookGenre) {
  }

  async create(dto: CreateGenreDto) {
    const genre = await this.genreRepository.create({...dto, sum: 0, sales: 0})
    await genre.$set('books', [])
    genre.books = []
    return genre
  }

  async changeName(dto: ChangeNameDto) {
    const genre = await this.genreRepository.findByPk(dto.id)
    genre.name = dto.name
    await genre.save()
    return genre
  }

  async getAllByBookId(id: number) {
    const book_genres = await this.bookGenreRepository.findAll({where: {bookId: id}})
    const genreIds = []
    if (book_genres.length !== 0) {
      book_genres.forEach(el => genreIds.push(el.genreId))
      return this.genreRepository.findAll({where: {id: {[Op.or]: genreIds}}})
    } else {
      return genreIds
    }
  }

  async getAll() {
    return this.genreRepository.findAll()
  }

  async getOneById(id: number) {
    return this.genreRepository.findByPk(id)
  }

  async delete(id: number) {
    const genre = await this.genreRepository.findByPk(id)
    if (!genre) {
      throw new HttpException("Жанр не найден", HttpStatus.BAD_REQUEST)
    }
    await this.bookGenreRepository.destroy({where: {genreId: id}})
    await genre.destroy()
    return genre
  }
}
