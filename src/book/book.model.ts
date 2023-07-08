import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { Genre } from "../genre/genre.model";
import { BookGenre } from "../intermediate-table/book-genre.model";
import {Order} from "../order/order.model";
import {BookOrder} from "../intermediate-table/book-order.model";

interface BookCreationAttrs {
  name: string;
  price: number;
  discount_price: number;
  file: string;
  image: string;
  token: string;
  description: string;
  beginning_book: string;
  visibility: boolean;
  sales: number;
  sum: number;
}

@Table({ tableName: 'books' })
export class Book extends Model<Book, BookCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.FLOAT, allowNull: false})
  price: number;

  @Column({type: DataType.FLOAT, allowNull: false, defaultValue: -1})
  discount_price: number;

  @Column({type: DataType.STRING, allowNull: false})
  file: string;

  @Column({type: DataType.STRING, allowNull: false})
  image: string;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  token: string;

  @Column({type: DataType.TEXT, allowNull: false})
  description: string;

  @Column({type: DataType.TEXT, allowNull: false})
  beginning_book: string;

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
  visibility: boolean;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  sales: number;

  @Column({type: DataType.FLOAT, allowNull: false, defaultValue: 0})
  sum: number;

  @BelongsToMany(() => Genre, () => BookGenre)
  genres: Genre[]

  @BelongsToMany(() => Order, () => BookOrder)
  orders: Order[]
}