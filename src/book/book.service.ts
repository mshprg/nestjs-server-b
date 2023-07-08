import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Book} from "./book.model";
import {CreateBookDto} from "./dto/create-book.dto";
import {FilesService, TypeFile} from "../files/files.service";
import {ChangeBookDto} from "./dto/change-book.dto";
import {GetBookFiltersDto} from "./dto/get-book-filters.dto";
import {Op} from "sequelize";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {Genre} from "../genre/genre.model";
import {Sequelize} from "sequelize-typescript";

@Injectable()
export class BookService {
  constructor(@InjectModel(Book) private bookRepository: typeof Book,
              @InjectModel(BookGenre) private bookGenreRepository: typeof BookGenre,
              @InjectModel(Genre) private genreRepository: typeof Genre,
              private fileService: FilesService) {
  }

  async create(dto: CreateBookDto, image, file_pdf, file_epb) {
    const fileName = await this.fileService.createBookFiles(file_pdf, file_epb)
    const imageName = await this.fileService.createImageFile(image)
    const book = await this.bookRepository.create(
      { ...dto, file: fileName, image: imageName, token: dto.name.toLowerCase()
          .replaceAll(" ", '') + '-' + Date.now() })
    await book.$set('genres', [])
    await book.$set('orders', [])
    book.genres = []
    book.orders = []
    return book
  }

  async changeBook(dto: ChangeBookDto, image, file_pdf, file_epb) {
    const book = await this.bookRepository.findByPk(dto.id)
    if (!book) {
      throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
    }
    if (file_pdf.originalname.split('.').pop()[0] !== book.file ||
      file_epb.originalname.split('.').pop()[0] !== book.file) {
      const fileName = await this.fileService.createBookFiles(file_pdf, file_epb)
      await this.fileService.removeFile(book.file + ".pdf", TypeFile.BOOK)
      await this.fileService.removeFile(book.file + ".epb", TypeFile.BOOK)
      book.file = fileName
    }
    if (image.originalname.split('.').pop()[0] !== book.image) {
      const imageName = await this.fileService.createImageFile(image)
      await this.fileService.removeFile(book.image, TypeFile.IMAGE)
      book.image = imageName
    }
    const genres_candidate = await this.genreRepository.findAll({where:
        {id: {[Op.or]: dto.genreIds}}
    })
    if (genres_candidate.length !== dto.genreIds.length) {
      throw new HttpException("Один или несколько жанров не существует", HttpStatus.BAD_REQUEST)
    }
    const genre_book_list: any[] = await this.bookGenreRepository.findAll({where:
        {
          bookId: dto.id,
          genreId: {
            [Op.or]: dto.genreIds
          }
        }
    })
    for (let i = 0; i < dto.genreIds.length; i++) {
      if (!genre_book_list.includes(el => el.genreId === dto.genreIds[i])) {
        await this.bookGenreRepository.create({bookId: book.id, genreId: dto.genreIds[i]})
        await book.$add('genre', dto.genreIds[i])
      }
    }
    book.name = dto.name
    book.token = dto.name.toLowerCase() .replaceAll(" ", '') + '-' + Date.now()
    book.beginning_book = dto.beginning_book
    book.price = dto.price
    book.visibility = dto.visibility
    book.description = dto.description
    book.discount_price = dto.discount_price
    await book.save()
    return book
  }

  async deleteBook(id: number) {
    await this.bookRepository.destroy({where: {id}})
    return {message: "Success"}
  }

  async getOne(token: string) {
    return await this.bookRepository.findOne({where: {token}})
  }

  async getAll() {
    return await this.bookRepository.findAll()
  }

  async getAllByFilterPage(dto: GetBookFiltersDto) {
    const limit = 15
    const offset = dto.page * limit - limit
    const genreIds = JSON.parse(dto.genres)
    let bookIds = []
    const book_genres = await this.bookGenreRepository.findAll({
      where: {genreId: {[Op.or]: genreIds}}
    })
    book_genres.forEach(el => {
      bookIds.push(el.bookId)
    })
    if (bookIds.length === 0 && genreIds.length !== 0) {
      return {count: 0, rows: [], pageCount: 0}
    } else {
      const all_books = await this.bookRepository.findAll()
      const books_row = await this.bookRepository.findAndCountAll({
        where: {
          id: {[Op.or]: bookIds},
          price: {[Op.gte]: dto.min_price, [Op.lte]: dto.max_price},
        },
        limit,
        offset
      })
      return {...books_row, pageCount: Math.floor(all_books.length / limit) + 1}
    }
  }

  async getPrices() {
    const books = await this.getAll()
    let min = 0, max = 0
    if (books.length !== 0) {
      books.sort((prev, next) => prev.price - next.price)
      min = books[0].price
      max = books[books.length - 1].price
    }
    return {min, max}
  }

  async getLastBook() {
    return this.bookRepository.findOne()
  }

  async getBookByIds(array: string) {
    const bookIds = JSON.parse(array)

    return await this.bookRepository.findAll({
      where: {id: {[Op.or]: bookIds}}
    })
  }
}
