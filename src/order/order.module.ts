import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Genre} from "../genre/genre.model";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {BookOrder} from "../intermediate-table/book-order.model";
import {Order} from "./order.model";
import {Book} from "../book/book.model";
import {OrderController} from "./order.controller";

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([Genre, BookOrder, Order, Book])
  ]
})
export class OrderModule {}
