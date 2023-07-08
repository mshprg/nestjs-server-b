import { Column, DataType, Table, Model, BelongsToMany } from "sequelize-typescript";
import { Book } from "../book/book.model";
import {BookOrder} from "../intermediate-table/book-order.model";

interface OrderCreationAttrs {
  name: string;
  email: string;
  token: string;
  date: number;
  price: number;
}

@Table({ tableName: 'orders', createdAt: false })
export class Order extends Model<Order, OrderCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: false})
  token: string;

  @Column({type: DataType.STRING, allowNull: false})
  email: number;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: Date.now()})
  date: number;

  @Column({type: DataType.FLOAT, allowNull: false, defaultValue: 0})
  price: number;

  @BelongsToMany(() => Book, () => BookOrder)
  books: Book[]
}