import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Genre} from "../genre/genre.model";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {BookOrder} from "../intermediate-table/book-order.model";
import {Order} from "./order.model";
import {Book} from "../book/book.model";
import {OrderController} from "./order.controller";
import {TempOrder} from "./temp-order.model";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getMailConfig} from "../configs/mail.config";

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([Genre, BookOrder, Order, Book, TempOrder, BookGenre]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
  ]
})
export class OrderModule {}
