import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import {BookController} from "./book.controller";
import {FilesModule} from "../files/files.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Book} from "./book.model";
import {BookGenre} from "../intermediate-table/book-genre.model";
import {Genre} from "../genre/genre.model";

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [
      FilesModule,
      SequelizeModule.forFeature([Book, BookGenre, Genre])
  ]
})
export class BookModule {}
