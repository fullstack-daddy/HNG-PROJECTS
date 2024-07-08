import { Sequelize } from 'sequelize';
import UserModel from './User.js';
import OrganisationModel from './Organisation.js';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const User = UserModel(sequelize, Sequelize);
const Organisation = OrganisationModel(sequelize, Sequelize);

const models = {
  User,
  Organisation,
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { User, Organisation };
export default models;
export { sequelize };
