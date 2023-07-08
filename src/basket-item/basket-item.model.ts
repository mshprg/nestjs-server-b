import {Column, DataType, Table, Model, BelongsTo, ForeignKey} from "sequelize-typescript";
import {Basket} from "../basket/basket.model";
import {Book} from "../book/book.model";

interface BasketItemCreationAttrs {
  bookId: number;
  basketToken: number;
}

@Table({ tableName: 'basket-item' })
export class BasketItem extends Model<BasketItem, BasketItemCreationAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Basket)
  @Column({type: DataType.BIGINT, allowNull: false})
  basketToken: number;

  @ForeignKey(() => Book)
  @Column({type: DataType.INTEGER, allowNull: false})
  bookId: number;

  @BelongsTo(() => Basket)
  basket: Basket;

  @BelongsTo(() => Book)
  book: Book;
}