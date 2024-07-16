import { Model, Table, Column, DataType, AllowNull } from "sequelize-typescript";

@Table({
  tableName: "agbCodes",
})
export default class AgbCode extends Model {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    primaryKey: true,
    field: "agbCode"
  })
  agbCode?: string;

  @Column({
    type: DataType.STRING(255),
    field: "name"
  })
  name?: string;

  @Column({
    type: DataType.STRING(255),
    field: "phoneNumber"
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING(255),
    field: "email"
  })
  email?: string;

  @Column({
    type: DataType.STRING(255),
    field: "street"
  })
  street?: string;

  @Column({
    type: DataType.STRING(255),
    field: "houseNumber"
  })
  houseNumber?: string;

  @Column({
    type: DataType.STRING(255),
    field: "houseNumberAddition"
  })
  houseNumberAddition?: string;

  @Column({
    type: DataType.STRING(255),
    field: "postalCode"
  })
  postalCode?: string;

  @Column({
    type: DataType.STRING(255),
    field: "city"
  })
  city?: string;
}
