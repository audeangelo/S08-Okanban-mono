import { sequelize } from '../db.js';
import Card from './card.js';
import List from './list.js';
import Tag  from './tag.js';

/* Associations */

// List ↔ Card
// One-to-Many : hasMany + belongsTo
List.hasMany(Card, {
  as: 'cards',
  foreignKey: 'list_id',
});

Card.belongsTo(List, {
  as: 'list',
  foreignKey: 'list_id',
});

// Card ↔ Tag
// Many-to-Many : belongsToMany + belongsToMany
Card.belongsToMany(Tag, {
  as: 'tags',
  through: 'card_has_tag',
  foreignKey: 'card_id',
  otherKey: 'tag_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Tag.belongsToMany(Card, {
  as: 'cards',
  through: 'card_has_tag',
  foreignKey: 'tag_id',
  otherKey: 'card_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { Card, List, Tag };
