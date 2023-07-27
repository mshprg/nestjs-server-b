import {forwardRef, Module} from '@nestjs/common';
import { BookService } from './book.service';
import {BookController} from "./book.controller";
import {FilesModule} from "../files/files.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Book} from "./book.model";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {Genre} from "../genre/genre.model";
import {BookOrder} from "../intermediate-table/book-order.model";
import {BasketItem} from "../basket-item/basket-item.model";
import {AuthModule} from "../auth/auth.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [
    FilesModule,
    SequelizeModule.forFeature([Book, BookGenre, Genre, BookOrder, BasketItem]),
    AuthModule,
    JwtModule
  ],
})
export class BookModule {}
