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
import {BookOrder} from "../intermediate-table/book-order.model";
import * as fs from "fs"
import {Response} from "express";
import {BasketItem} from "../basket-item/basket-item.model";

@Injectable()
export class BookService {
  constructor(@InjectModel(Book) private bookRepository: typeof Book,
              @InjectModel(BookGenre) private bookGenreRepository: typeof BookGenre,
              @InjectModel(BookOrder) private bookOrderRepository: typeof BookOrder,
              @InjectModel(BasketItem) private basketItemRepository: typeof BasketItem,
              @InjectModel(Genre) private genreRepository: typeof Genre,
              private fileService: FilesService) {
  }

  async create(dto: CreateBookDto, image, file_pdf, file_epb) {
    const fileName = await this.fileService.createBookFiles(file_pdf, file_epb)
    const imageName = await this.fileService.createImageFile(image)
    const book = await this.bookRepository.create(
      { ...dto, file: fileName, image: imageName, token: "bookbyte" + '-' + Date.now() })
    await book.$set('genres', [])
    await book.$set('orders', [])
    book.genres = []
    book.orders = []
    return book
  }

  async changeBook(dto: ChangeBookDto, image, file_pdf, file_epb) {
    const genreIds: number[] = JSON.parse(dto.genreIds)
    const book = await this.bookRepository.findByPk(dto.id)
    if (!book) {
      throw new HttpException("Книга не найдена", HttpStatus.NOT_FOUND)
    }
    if (file_pdf && file_epb) {
      file_epb = file_epb[0]
      file_pdf = file_pdf[0]
      if (file_pdf.originalname.split('.').pop()[0] !== book.file ||
        file_epb.originalname.split('.').pop()[0] !== book.file) {
        const fileName = await this.fileService.createBookFiles(file_pdf, file_epb)
        await this.fileService.removeFile(book.file + ".pdf", TypeFile.BOOK)
        await this.fileService.removeFile(book.file + ".epub", TypeFile.BOOK)
        book.file = fileName
      }
    }
    if (image) {
      image = image[0]
      if (image.originalname.split('.')[0] !== book.image.split('.')[0]) {
        const imageName = await this.fileService.createImageFile(image)
        await this.fileService.removeFile(book.image, TypeFile.IMAGE)
        book.image = imageName
      }
    }
    if (genreIds.length !== 0) {
      const genres_candidate = await this.genreRepository.findAll({where:
          {id: {[Op.or]: genreIds}}
      })
      if (genres_candidate.length !== genreIds.length) {
        throw new HttpException("Один или несколько жанров не существует", HttpStatus.BAD_REQUEST)
      }
      const genre_book_list: any[] = await this.bookGenreRepository.findAll({where:
          {
            bookId: dto.id,
          }
      })
      for (let i = 0; i < genreIds.length; i++) {
        if (!genre_book_list.find(el => el.genreId === genreIds[i])) {
          await this.bookGenreRepository.create({bookId: book.id, genreId: genreIds[i]})
        }
      }
      const genreIdsForDelete = []
      for (let i = 0; i < genre_book_list.length; i++) {
        if (!genreIds.find(id => id === genre_book_list[i].genreId)) {
          genreIdsForDelete.push(genre_book_list[i].genreId)
        }
      }
      if (genreIdsForDelete.length !== 0) {
        await this.bookGenreRepository.destroy({where:
            {
              bookId: dto.id,
              genreId: {
                [Op.or]: genreIdsForDelete
              }
            }
        })
      }
    } else {
      await this.bookGenreRepository.destroy({where: {bookId: dto.id}})
    }
    book.name = dto.name
    book.beginning_book = dto.beginning_book
    book.price = dto.price
    book.visibility = dto.visibility
    book.description = dto.description
    book.discount_price = dto.discount_price
    await book.save()
    return book
  }

  async deleteBook(id: number) {
    const book = await this.bookRepository.findOne({where: {id}})
    if (!book) {
      throw new HttpException("Книга с таким id не существует", HttpStatus.BAD_REQUEST)
    }
    await this.bookGenreRepository.destroy({where: {bookId: id}})
    await this.bookOrderRepository.destroy({where: {bookId: id}})
    await this.basketItemRepository.destroy({where: {bookId: id}})
    await book.destroy()
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
    let book_genres = []
    if (genreIds.length !== 0) {
      book_genres = await this.bookGenreRepository.findAll({
        where: {genreId: {[Op.or]: genreIds}}
      })
    }
    book_genres.forEach(el => {
      if (bookIds.indexOf(el.bookId) !== -1) {
        bookIds.push(el.bookId)
      }
    })
    if (bookIds.length === 0 && genreIds.length !== 0) {
      return {count: 0, rows: [], pageCount: 0}
    } else {
      const all_books = await this.bookRepository.findAll({
        where: {
          id: {[Op.or]: bookIds},
          price: {[Op.gte]: dto.min_price, [Op.lte]: dto.max_price},
          name: {[Op.iRegexp]: `${dto.name}`}
        },
      })
      console.log(all_books)
      const books_row = await this.bookRepository.findAndCountAll({
        where: {
          id: {[Op.or]: bookIds},
          price: {[Op.gte]: dto.min_price, [Op.lte]: dto.max_price},
          name: {[Op.iRegexp]: `${dto.name}`}
        },
        limit,
        offset
      })
      const count = Math.floor(all_books.length / limit)
      return {...books_row, pageCount: count !== 0 ? count : 1}
    }
  }

  async getPrices() {
    const books = await this.bookRepository.findAll({where: {visibility: true}})
    let min = 0, max = 0
    if (books.length !== 0) {
      books.sort((prev, next) => prev.price - next.price)
      min = books[0].price
      max = books[books.length - 1].price
      console.log(books[0])
      console.log(books[books.length - 1])
      console.log(min, max)
    }
    return {min, max}
  }

  async getLastBook() {
    const books = await this.bookRepository.findAll({order: [['createdAt', 'DESC']]})
    return books[0]
  }

  async getBookByIds(array: string) {
    const bookIds = JSON.parse(array)

    return await this.bookRepository.findAll({
      where: {id: {[Op.or]: bookIds}}
    })
  }

  async getBookByOrderId(id: number) {
    const book_orders = await this.bookOrderRepository.findAll({where: {orderId: id}})
    const bookIds = []
    book_orders.forEach(item => {
      bookIds.push(item.bookId)
    })
    if (bookIds.length !== 0) {
      const booksData = await this.bookRepository.findAll({where: {id: {[Op.or]: bookIds}}})
      const books = []
      booksData.forEach(book => {
        const book_order = book_orders.find(el => el.bookId === book.id)
        books.push({...book.dataValues, price: book_order.price})
      })
      return books
    } else {
      return []
    }
  }

  async downloadBookFile(name: string, type: string, res: Response) {
    const pathFile = await this.fileService.pathForDownloadFile() + '\\' + name + type
    if (fs.existsSync(pathFile)) {
      return res.download(pathFile, "book" + type)
    }
    return res
  }
}
