import Sequelize from "sequelize";

// logging: false, will disable logging of every sql query
const sequelize = new Sequelize(
  "postgres://postgres:root@localhost:5432/learning",
  { logging: false }
);

export default sequelize;
