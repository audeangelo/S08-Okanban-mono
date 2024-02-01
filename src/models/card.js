import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class Card extends Model {};

Card.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  color: {
    type: DataTypes.STRING(7),
  },
}, {
  sequelize,
  modelName: 'Card',
  tableName: 'card',
});

export default Card;
