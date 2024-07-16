import { Sequelize } from "sequelize-typescript";
import AgbCode from "./models/agbCodes.model";
import { DataTypes } from "sequelize";


class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: 'mydatabase',
      username: 'myuser',
      password: 'mypassword',
      port: 5001,
      host: 'localhost',
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      models: [AgbCode]
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err: any) => {
        console.error("Unable to connect to the Database:", err);
      });
  }
}

export default Database;