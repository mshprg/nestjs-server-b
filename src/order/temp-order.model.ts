import { Column, DataType, Table, Model } from "sequelize-typescript";

interface TempOrderCreationAttrs {
    token: string;
}

@Table({ tableName: 'temp-orders' })
export class TempOrder extends Model<TempOrder, TempOrderCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    token: string;
}