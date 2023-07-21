import { Column, DataType, Table, Model } from "sequelize-typescript";

interface TempOrderCreationAttrs {
    token: string;
    paymentId: string;
    name: string;
    email: string;
    price: number;
    bookIds: string;
}

@Table({ tableName: 'temp-orders' })
export class TempOrder extends Model<TempOrder, TempOrderCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    price: number;

    @Column({type: DataType.STRING, allowNull: false})
    token: string;

    @Column({type: DataType.STRING, allowNull: false})
    paymentId: string;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    bookIds: string;
}