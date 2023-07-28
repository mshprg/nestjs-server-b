import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SequelizeModule } from "@nestjs/sequelize";
import { BookModule } from './book/book.module';
import { FilesModule } from './files/files.module';
import * as path from "path"
import { Book } from "./book/book.model";
import { GenreModule } from './genre/genre.module';
import {BookGenre} from "./intermediate-table/book-genre.model";
import {BookOrder} from "./intermediate-table/book-order.model";
import {Genre} from "./genre/genre.model";
import {Order} from "./order/order.model";
import {Basket} from "./basket/basket.model";
import {BasketItem} from "./basket-item/basket-item.model";
import {BasketModule} from "./basket/basket.module";
import {BasketItemModule} from "./basket-item/basket-item.module";
import {OrderModule} from "./order/order.module";
import {TempOrder} from "./order/temp-order.model";
import { AuthModule } from './auth/auth.module';
import pg from "pg";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static')
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectModule: pg,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Book, BookGenre, BookOrder, Genre, Order, Basket, BasketItem, TempOrder],
      autoLoadModels: true,
    }),
    BookModule,
    FilesModule,
    GenreModule,
    BasketModule,
    BasketItemModule,
    OrderModule,
    AuthModule
  ],
})
export class AppModule {}