// import { Card, List, Tag, CardHasTag } from '../src/models/index.js';
import { sequelize } from '../src/db.js';

createTables();

async function createTables() {
  console.log('🔄 Okanban tables creation started…');

  // console.log("\t- Dropping existing tables first\n");
  // await Tag.drop({ cascade: true });
  // await Card.drop({ cascade: true });
  // await List.drop({ cascade: true });
  // await CardHasTag.drop({ cascade: true });

  // console.log("\n\t- Creating new tables\n");
  // await List.sync();
  // await Card.sync();
  // await Tag.sync();
  // await CardHasTag.sync();
  await sequelize.sync({ force: true });

  console.log("\n✅ Okanban tables created with success!");
  
  console.log("\n🧹 Clean up by closing database connection\n");
  await sequelize.close();
}
