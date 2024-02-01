import { Card, List, Tag } from '../src/models/index.js';
import { sequelize } from '../src/db.js';

seedTables();

async function seedTables() {
  console.log("🔄 Okanban seeding started…");

  // create Tags
  const [urgentTag] = await Tag.findOrCreate({
    where: { name: 'Urgent' },
    defaults: { name: 'Urgent', color: '#b00' }
  });
  const [lateTag] = await Tag.findOrCreate({
    where: { name: 'Retard' },
    defaults: { name: 'Retard', color: '#f0f' }
  });
  const [ideaTag] = await Tag.findOrCreate({
    where: { name: 'Idée' },
    defaults: { name: 'Idée', color: '#fb0' }
  });

  // Create List and Cards (in one batch !)
  await List.bulkCreate([
    { name: 'Backlog', position: 1, cards: [
      { content: 'Créer les routes', color: '#abf', position: 1 },
      { content: 'Sécuriser notre API', color: '#b0b', position: 2 },
    ] },

    { name: 'To do', position: 2, cards: [
      { content: 'Faire le DDS', color: '#fab', position: 1},
      { content: 'Mettre en place API', color: '#abf', position: 2},
      { content: 'Créer les models', color: '#abf', position: 3},
    ] },

    { name: 'WIP', position: 3, cards: [
      { content: 'Créer un script pour le seeding', color: '#bfa', position: 1},
    ] },

    { name: 'To test', position: 4, cards: [
      { content: 'Créer la BDD', color: '#bfa', position: 1},
      { content: 'Créer un script pour les tables', color: '#bfa', position: 2},
    ] },

    { name: 'Done', position: 5, cards: [
      { content: 'Faire les User Stories', color: '#fab', position: 1 },
      { content: 'Faire le MCD', color: '#fab', position: 2 },
    ] },
  ], { include: 'cards' });

  // Add Tags to some Cards
  await addTagToCard('Créer la BDD', urgentTag);
  await addTagToCard('Créer un script pour les tables', urgentTag);
  await addTagToCard('Créer un script pour le seeding', urgentTag);
  await addTagToCard('Faire le DDS', lateTag);
  await addTagToCard('Sécuriser notre API', ideaTag);

  console.log("✅ Okanban seed done with success!");

  console.log("🧹 Clean up by closing database connection");
  await sequelize.close();
}

async function addTagToCard(cardContent, tagEntity) {
  const card = await Card.findOne({ where: { content: cardContent }});
  await card.addTag(tagEntity);
}
