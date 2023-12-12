import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { Book } from "../book/book.model";
import { BookGenre } from "../intermediate-table/book-genre.model";

interface GenreCreationAttrs {
  name: string;
  sales: number;
  sum: number;
}

@Table({ tableName: 'genres' })
export class Genre extends Model<Genre, GenreCreationAttrs> {

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  sales: number;

  @Column({type: DataType.FLOAT, allowNull: false, defaultValue: 0})
  sum: number;

  @BelongsToMany(() => Book, () => BookGenre)
  books: Book[]
}