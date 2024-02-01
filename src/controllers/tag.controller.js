import Joi from 'joi';

import errorController from './error.controller.js';
import { Card, Tag } from '../models/index.js';
import { findOne } from '../utils/index.js';

async function getAll(req, res) {
  const tags = await Tag.findAll();

  res.json(tags);
}

async function getOne(req, res) {
  const tag = await findOne(Tag, req, res);

  if (!tag) {
    return;
  }

  res.json(tag);
}

async function createTag(req, res) {
  const { body } = req;

  const createTagSchema = Joi.object({
    name: Joi.string().min(1).required(),
    color: Joi.string()
      .regex(/^#[0-9a-fA-F]{3,6}$/)
      .message("Property 'color' should be a valid hexadecimal code"),
  });

  const { error } = createTagSchema.validate(body);

  if (error) {
    return errorController._400([error.message], req, res);
  }

  // je vérifie que le tag n'existe pas déjà (name UNIQUE)
  const existingTag = await alreadyExists(body.name);

  if (existingTag) {
    return errorController._400(
      ["The provided 'name' is already taken"],
      req,
      res
    );
  }

  const { name, color } = body;
  const createdTag = await Tag.create({ name, color });

  res.status(201).json(createdTag);
}

async function updateTag(req, res) {
  const tag = await findOne(Tag, req, res);

  if (!tag) {
    return;
  }

  const { body } = req;

  const updateTagSchema = Joi.object({
    name: Joi.string().min(1),
    color: Joi.string()
      .regex(/^#[0-9a-fA-F]{3,6}$/)
      .message("Property 'color' should be a valid hexadecimal code"),
  })
    .min(1)
    .message(
      "Missing body parameters. Provide at least one of the following properties : name, color"
    );

  const { error } = updateTagSchema.validate(body);
  if (error) {
    return errorController._400([error.message], req, res);
  }

  // si on veut modifier le nom du label
  // je vérifie que celle-ci n'existe pas
  // sinon erreur 400
  if (body.name && (await alreadyExists(body.name))) {
    return errorController._400(
      ["The provided 'name' is already taken"],
      req,
      res
    );
  }

  const { name, color } = body;

  tag.name = name || tag.name;
  tag.color = color || tag.color;

  await tag.save();

  res.json(tag);
}

async function deleteTag(req, res) {
  const tag = await findOne(Tag, req, res);

  if (!tag) {
    return;
  }

  await Tag.destroy();

  res.status(204).end();
}

async function addTagToCard(req, res) {
  // 1. je récupère les paramètres
  const { cardId, tagId } = req.params;

  const bodyErrors = [];

  // 2. je vérifie que la carte existe
  const card = await Card.findByPk(cardId);

  if (!card) {
    bodyErrors.push("'cardId' should be a valid ID");
  }

  // 3. je vérifie que le label existe
  const tag = await Tag.findByPk(tagId);

  if (!tag) {
    bodyErrors.push("'tagId' should be a valid ID");
  }

  // 4. je gère les erreurs
  if (bodyErrors.length) {
    return errorController._400(bodyErrors, req, res);
  }

  // 5. j'ajoute le label à la carte
  // → la force d'un ORM tel que Sequelize :
  // pas besoin d'ajouter dans la table de liaison 'card_has_tag',
  // avec les associations, il fournit une méthode !
  await card.addTag(tag);

  /*
    NOTE : lors de l'ajout, j'ai une erreur en retour
    due à l'absence de `updated_at` dans la table de liaison !!!

    j'ai pas l'impression d'avoir fait une erreur au niveau de mon code ;
    mais j'ai décidé d'ajouter la colonne à ma table
    (voir create_table.sql + npm run db:reset)
  */

  // 6. je retourne la carte mise à jour
  // je dois récupérer de nouveau depuis la BDD pour avoir les modif
  // j'en profite pour récupérer les tags
  const updatedCard = await Card.findByPk(cardId, {
    include: [
      {
        association: "tags",
        through: { attributes: [] },
      },
    ],
  });
  res.status(201).json(updatedCard);
}

async function removeTagFromCard(req, res) {
  // 1. je récupère les paramètres
  const { cardId, tagId } = req.params;

  const bodyErrors = [];

  // 2. je vérifie que la carte existe
  const card = await Card.findByPk(cardId);

  if (!card) {
    bodyErrors.push("'cardId' should be a valid ID");
  }

  // 3. je vérifie que le label existe
  const tag = await Tag.findByPk(tagId);

  if (!tag) {
    bodyErrors.push("'tagId' should be a valid ID");
  }

  // 4. je supprime le label de la carte
  await card.removeTag(tag);

  // 6. je retourne la carte mise à jour
  // je dois récupérer de nouveau depuis la BDD pour avoir les modif
  // j'en profite pour récupérer les tags
  const updatedCard = await Card.findByPk(cardId, {
    include: [
      {
        association: "tags",
        through: { attributes: [] },
      },
    ],
  });
  res.json(updatedCard);
}

async function alreadyExists(name) {
  const tag = await Tag.findOne({ where: { name } });
  return !!tag;
}

export default {
  getAll,
  getOne,
  createTag,
  updateTag,
  deleteTag,
  addTagToCard,
  removeTagFromCard,
};
