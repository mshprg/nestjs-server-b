import {Table, Model, ForeignKey, Column, HasOne, DataType} from "sequelize-typescript";
import { Book } from "../book/book.model";
import {Order} from "../order/order.model";

interface BookOrderCreationAttrs {
  price: number;
  bookId: number;
  orderId: number;
}

@Table({ tableName: 'book-orders', createdAt: false, updatedAt: false,  })
export class BookOrder extends Model<BookOrder, BookOrderCreationAttrs> {

  @Column({type: DataType.FLOAT, allowNull: false})
  price: number;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;
}