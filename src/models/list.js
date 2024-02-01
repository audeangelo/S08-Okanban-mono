import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class List extends Model {};

List.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'List',
  tableName: 'list',
});

export default List;
