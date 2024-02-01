import 'dotenv/config'

import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  dialect: process.env.DB_DRIVER,
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

/*
ou avec l'URL
const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});
*/
