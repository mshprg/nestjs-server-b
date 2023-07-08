import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Order} from "./order.model";
import {CreateOrderDto} from "./dto/create-order.dto";
import {Book} from "../book/book.model";
import {Op} from "sequelize";
import {Genre} from "../genre/genre.model";
import {BookOrder} from "../intermediate-table/book-order.model";
import {ICreatePayment, YooCheckout} from "@a2seven/yoo-checkout";
import * as uuid from "uuid"
import {CreatePaymentDto} from "./dto/create-payment.dto";

@Injectable()
export class OrderService {

  constructor(@InjectModel(Order) private orderRepository: typeof Order,
              @InjectModel(Book) private bookRepository: typeof Book,
              @InjectModel(Genre) private genreRepository: typeof Genre,
              @InjectModel(BookOrder) private bookOrderRepository: typeof BookOrder) {
  }

  async create(dto: CreateOrderDto) {
    let fullPrice = 0
    let genresSales = []
    let genreIds = []
    const bookIds = JSON.parse(dto.bookIds)
    const books = await this.bookRepository.findAll({where:
        {id: {[Op.or]: bookIds}}
    })
    if (books.length !== bookIds.length) {
      throw new HttpException("Одной или несколькиз книг в заказе не существует", HttpStatus.BAD_REQUEST)
    } else {
      books.forEach(book => {
        fullPrice += book.price
        book.genres.forEach(genre => {
          genresSales.push({id: genre.id, price: book.price})
          genreIds.push(genre.id)
        })
        if (!book.visibility) {
          throw new HttpException("Одна или несколько книг в заказе не доступны для продажи", HttpStatus.BAD_REQUEST)
        }
      })
    }
    await this.genreRepository.increment('sales',
      {
        by: 1,
        where: {
          id: {[Op.or]: genreIds}
        }
      }
    )
    //genresSales.sort((prev, next) => prev.price - next.price)
    for (let i = 0; i < genresSales.length; i++) {
      const genre = await this.genreRepository.findOne({where: {id: genresSales[i].id}})
      await genre.increment('sum', {by: genresSales[i].price})
    }
    const date = (Date.now() + "").split('').reverse().join('')
    const order = await this.orderRepository.create({
      name: dto.name,
      email: dto.email,
      token: "1",
      date: Date.now(),
      price: fullPrice
    })
    order.token = date + order.id + ""
    await order.$set('books', books)
    order.books = books
    await order.save()
    for (let i = 0; i < books.length; i++) {
      await this.bookOrderRepository.create({
        bookId: books[i].id,
        orderId: order.id
      })
      await books[i].$add('order', order)
    }
    return order
  }

  async getAllPage(page: number) {
    if (page < 1) throw new HttpException("Ошибка: номер страницы меньше 1", HttpStatus.INTERNAL_SERVER_ERROR)
    const limit = 15
    const offset = page * limit - limit
    return await this.orderRepository.findAndCountAll({limit, offset})
  }

  async getOneById(id: number) {
    return this.orderRepository.findByPk(id)
  }

  async getOneByToken(token: string) {
    return this.orderRepository.findOne({where: {token}})
  }

  async delete(id: number) {
    await this.orderRepository.destroy({where: {id}})
    return "deleted"
  }

  async createPayment(dto: CreatePaymentDto) {
    try {
      const checkout = new YooCheckout({shopId: '214872', secretKey: 'test_jOGJQ29WtprKkZ8Bprgx_zN9TdtYLk7nZkD-m3H0kgI'})
      const idempotenceKey = uuid.v4()
      const createPayload: ICreatePayment = {
        amount: {
          value: dto.price.toString(),
          currency: 'RUB'
        },
        payment_method_data: {
          type: 'bank_card'
        },
        confirmation: {
          type: 'redirect',
          return_url: 'http://localhost:3000/make-order'
        },
        capture: true
      }
      return await checkout.createPayment(createPayload, idempotenceKey)
    } catch (e) {
      console.log(e)
    }
  }

}
