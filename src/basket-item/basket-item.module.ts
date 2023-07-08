import { Module } from '@nestjs/common';
import { BasketItemController } from './basket-item.controller';
import { BasketItemService } from './basket-item.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Basket} from "../basket/basket.model";
import {BasketItem} from "./basket-item.model";
import {Book} from "../book/book.model";

@Module({
  controllers: [BasketItemController],
  providers: [BasketItemService],
  imports: [
    SequelizeModule.forFeature([Basket, BasketItem, Book])
  ]
})
export class BasketItemModule {}
