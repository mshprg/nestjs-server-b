import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { Book } from "../book/book.model";
import {BookOrder} from "../intermediate-table/book-order.model";

interface OrderCreationAttrs {
  name: string;
  email: string;
  token: string;
  number: string;
  date: number;
  price: number;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderCreationAttrs> {

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: false})
  token: string;

  @Column({type: DataType.STRING, allowNull: false})
  number: string;

  @Column({type: DataType.STRING, allowNull: false})
  email: number;

  @Column({type: DataType.BIGINT, allowNull: false, defaultValue: Date.now()})
  date: number;

  @Column({type: DataType.FLOAT, allowNull: false, defaultValue: 0})
  price: number;

  @BelongsToMany(() => Book, () => BookOrder)
  books: Array<Book & {BookAuthor: BookOrder}>
}