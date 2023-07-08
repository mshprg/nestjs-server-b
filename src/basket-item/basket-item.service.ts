import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {BasketItem} from "./basket-item.model";
import {CreateBasketItemDto} from "./dto/create-basket-item.dto";
import {Book} from "../book/book.model";
import {Basket} from "../basket/basket.model";

@Injectable()
export class BasketItemService {

  constructor(@InjectModel(BasketItem) private basketItemRepository: typeof BasketItem,
              @InjectModel(Book) private bookRepository: typeof Book,
              @InjectModel(Basket) private basketRepository: typeof Basket) {
  }

  async create(dto: CreateBasketItemDto) {
    const book = await this.bookRepository.findByPk(dto.bookId)
    const basket = await this.basketRepository.findOne({where: {token: dto.basketToken}})
    if (!book) {
      throw new HttpException(`Книги с id:${dto.bookId} не существует`, HttpStatus.BAD_REQUEST)
    }
    if (!basket) {
      throw new HttpException(`Токен ${dto.basketToken} невалиден`, HttpStatus.BAD_REQUEST)
    }
    const basketItemCandidate = await this.basketItemRepository.findOne({where:
        {basketToken: dto.basketToken, bookId: dto.bookId}
    })
    if (basketItemCandidate) {
      throw new HttpException(`В корзину уже добвлен этот товар`, HttpStatus.BAD_REQUEST)
    }
    return await this.basketItemRepository.create(dto)
  }

  async getAllByBasketToken(token: string) {
    return await this.basketItemRepository.findAll({where: {basketToken: token}})
  }

  async delete(id: number) {
    await this.basketItemRepository.destroy({where: {id}})
    return {message: "deleted"}
  }
}
