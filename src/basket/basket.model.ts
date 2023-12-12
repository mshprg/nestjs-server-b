import {Column, DataType, Table, Model, HasMany} from "sequelize-typescript";
import {BasketItem} from "../basket-item/basket-item.model";

interface BasketCreationAttrs {
  token: number;
  last_check: number;
}

@Table({ tableName: 'basket' })
export class Basket extends Model<Basket, BasketCreationAttrs> {

  @Column({type: DataType.BIGINT, unique: true, allowNull: false, primaryKey: true})
  token: number;

  @Column({type: DataType.BIGINT, allowNull: false, defaultValue: Date.now()})
  last_check: number;

  @HasMany(() => BasketItem)
  basket_items: BasketItem[]
}