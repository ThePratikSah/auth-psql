import dotenv from "dotenv";
import Sequelize from "sequelize";

// configuring dotenv for ENV variable(s)
dotenv.config();

const DB_URI = process.env.DB_URI;
export const PORT = process.env.PORT;

// logging: false, will disable logging of every sql query
const sequelize = new Sequelize(DB_URI, { logging: false });

export default sequelize;
