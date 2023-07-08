import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Basket} from "./basket.model";
import {BasketItem} from "../basket-item/basket-item.model";

@Module({
  providers: [BasketService],
  controllers: [BasketController],
  imports: [
    SequelizeModule.forFeature([Basket, BasketItem])
  ]
})
export class BasketModule {}
