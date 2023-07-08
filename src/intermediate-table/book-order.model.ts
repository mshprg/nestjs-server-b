import {Table, Model, ForeignKey, Column, DataType} from "sequelize-typescript";
import { Book } from "../book/book.model";
import {Order} from "../order/order.model";

interface BookOrderCreationAttrs {
  bookId: number;
  orderId: number;
}

@Table({ tableName: 'book-orders', createdAt: false, updatedAt: false })
export class BookOrder extends Model<BookOrder, BookOrderCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

}