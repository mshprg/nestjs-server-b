import {Table, Model, ForeignKey, Column, DataType} from "sequelize-typescript";
import { Book } from "../book/book.model";
import { Genre } from "../genre/genre.model";

interface BookGenreCreationAttrs {
  bookId: number;
  genreId: number;
}

@Table({ tableName: 'book-genres', createdAt: false, updatedAt: false })
export class BookGenre extends Model<BookGenre, BookGenreCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @ForeignKey(() => Genre)
  @Column
  genreId: number;

}