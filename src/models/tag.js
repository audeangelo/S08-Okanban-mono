import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class Tag extends Model {};

Tag.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  color: {
    type: DataTypes.STRING(7),
  },
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tag',
});

export default Tag;
