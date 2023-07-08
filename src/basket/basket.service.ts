import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Basket} from "./basket.model";
import {BasketItem} from "../basket-item/basket-item.model";
import {Op} from "sequelize";

@Injectable()
export class BasketService {

  constructor(@InjectModel(Basket) private basketRepository: typeof Basket,
              @InjectModel(BasketItem) private basketItemRepository: typeof BasketItem) {
  }

  async create(token: number) {
    return await this.basketRepository.create({
      token, last_check: Date.now()
    })
  }

  async deleteOld() {
    const old_baskets = await this.basketRepository.findAll({
      where: {last_check: {[Op.lt]: Date.now() - 2592000000}}
    })
    let basketTokens = []
    old_baskets.forEach(basket => {
      basketTokens.push(basket.token)
    })
    await this.basketItemRepository.destroy({
      where: {basketToken: {[Op.or]: basketTokens}}
    })
    await this.basketRepository.destroy({
      where: {id: {[Op.or]: basketTokens}}
    })
    return "deleted"
  }

  async getOneByToken(token: string) {
    return await this.basketRepository.findOne({where: {token}})
  }
}
