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
import {TempOrder} from "./temp-order.model";
import {BookGenre} from "../intermediate-table/book-genre.model";
import * as path from "path"
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class OrderService {

  constructor(@InjectModel(Order) private orderRepository: typeof Order,
              @InjectModel(Book) private bookRepository: typeof Book,
              @InjectModel(Genre) private genreRepository: typeof Genre,
              @InjectModel(BookGenre) private bookGenreRepository: typeof BookGenre,
              @InjectModel(BookOrder) private bookOrderRepository: typeof BookOrder,
              @InjectModel(TempOrder) private tempOrderRepository: typeof TempOrder,
              private mailerService: MailerService) {
  }

  private async create(dto: CreateOrderDto) {
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
      const book_genres = await this.bookGenreRepository.findAll({where: {bookId: {[Op.or]: bookIds}}})
      book_genres.forEach(item => {
        genreIds.push(item.genreId)
      })
      books.forEach(book => {
        fullPrice += book.price
        if (!book.visibility) {
          throw new HttpException("Одна или несколько книг в заказе не доступны для продажи", HttpStatus.BAD_REQUEST)
        }
      })
      if (book_genres.length !== 0) {
        const genres = await this.genreRepository.findAll({where: {id: {[Op.or]: genreIds}}})
        genres.forEach(genre => {
          const book_genre = book_genres.find(el => el.genreId === genre.id)
          if (book_genre) {
            const book = books.find(el => el.id === book_genre.bookId)
            genresSales.push({id: genre.id, price: book.price})
          }
        })
      }
    }
    if (genreIds.length !== 0) {
      await this.genreRepository.increment('sales',
        {
          by: 1,
          where: {
            id: {[Op.or]: genreIds}
          }
        }
      )
    }
    for (let i = 0; i < genresSales.length; i++) {
      const genre = await this.genreRepository.findOne({where: {id: genresSales[i].id}})
      await genre.increment('sum', {by: genresSales[i].price})
    }
    const number = Date.now().toString().split('').reverse().join('')
    const order = await this.orderRepository.create({
      name: dto.name,
      email: dto.email,
      token: dto.token,
      number,
      date: Date.now(),
      price: fullPrice
    })
    order.number = number + order.id
    await order.save()
    for (let i = 0; i < books.length; i++) {
      await this.bookOrderRepository.create({
        bookId: books[i].id,
        orderId: order.id,
        price: books[i].price,
      })
      await books[i].$add('order', order)
    }
    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Подтверждение регистрации',
        template: path.join(__dirname, '/../templates', 'orderNumber'),
        context: {
          code: order.number
        },
      })
      .catch((e) => {
        console.log(e)
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
    return order
  }

  async getAll() {
    return this.orderRepository.findAll()
  }

  async getOneById(id: number) {
    return this.orderRepository.findByPk(id)
  }

  async getOneByToken(token: string) {
    return this.orderRepository.findOne({where: {token}})
  }

  async getOneByNumber(number: string) {
    return this.orderRepository.findOne({where: {number}})
  }

  async delete(id: number) {
    await this.orderRepository.destroy({where: {id}})
    return "deleted"
  }

  async createPayment(dto: CreatePaymentDto) {
    const books = await this.bookRepository.findAll({where: {id: {[Op.or]: JSON.parse(dto.bookIds)}}})
    books.forEach(book => {
      if (!book.visibility) {
        throw new HttpException("Одна из книг недоступна для покупки", HttpStatus.BAD_REQUEST)
      }
    })
    const checkout = new YooCheckout({shopId: process.env.YOOKASSA_SHOP_ID, secretKey: process.env.YOOKASSA_SECRET_KEY})
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
        return_url: `https://${process.env.CLIENT}/paid/${idempotenceKey}`
      },
      capture: true
    }

    const payment = await checkout.createPayment(createPayload, idempotenceKey)
    await this.tempOrderRepository.create({...dto, token: idempotenceKey, paymentId: payment.id})

    return payment
  }

  async checkOrderForPay(token: string) {
    const tempOrder = await this.tempOrderRepository.findOne({where: {token}})
    const checkout = new YooCheckout({shopId: process.env.YOOKASSA_SHOP_ID, secretKey: process.env.YOOKASSA_SECRET_KEY})
    let payment = null
    if (tempOrder) {
      payment = await checkout.getPayment(tempOrder.paymentId)
    }
    if (tempOrder && payment) {
      if (payment.status !== "succeeded") {
        return undefined
      }
      JSON.parse(tempOrder.bookIds)
      const order = await this.create({name: tempOrder.name, email: tempOrder.email,
        bookIds: tempOrder.bookIds, token: tempOrder.token})
      await tempOrder.destroy()
      return order
    } else {
      return undefined
    }
  }
}
