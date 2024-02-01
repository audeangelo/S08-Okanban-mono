import Joi from 'joi';

import errorController from './error.controller.js';
import { Card, List } from '../models/index.js';
import { findOne, exists } from '../utils/index.js';

async function getAll(req, res) {
  const cards = await Card.findAll({
    order: [
      ['position', 'ASC'],
      ['created_at', 'DESC'],
    ],
  });

  res.json(cards);
}

async function getAllByList(req, res) {
  // 1. je récupère l'ID de le liste
  const listId = parseInt(req.params.id, 10);

  // 2. je vais chercher uniquement les cartes (avec les labels)
  // qui font parties de cette liste
  const cards = await Card.findAll({
    where: { list_id: listId },
    include: [
      {
        association: 'tags',
        through: { attributes: [] },
      }
    ]
  });

  // NOTE: pas besoin de vérifier si la liste existe ou non
  // → si n'existe pas, on renvoie un tableau vide
  res.json(cards);
}

async function getOne(req, res) {
  // 1. je vais chercher la carte grâce à ma fonction utilitaire
  // je veux préciser qu'il me faut les labels
  // → j'ajoute la possibilité de passer des options
  const sequelizeOptions = {
    include: [
      {
        association: 'tags',
        through: { attributes: [] },
      }
    ]
  };
  const card = await findOne(Card, req, res, sequelizeOptions);

  if (!card) {
    return;
  }

  // 2. je renvoie la carte au client au format JSON
  res.json(card);
}

async function createCard(req, res) {
  const { body } = req;
  
  // 2. je valide mes données
  const createCardSchema = Joi.object({
    content: Joi.string().min(1).required(),
    list_id: Joi.number().integer().required(),
    color: Joi.string()
      .regex(/^#[0-9a-fA-F]{3,6}$/)
      .message("Property 'color' should be a valid hexadecimal code"),
    position: Joi.number().integer().min(0),
  });

  const { error } = createCardSchema.validate(body);

  if (error) {
    return errorController._400([error.message], req, res);
  }

  // 2. je vérifie que la liste existe
  const list = exists(
    List, // je cherche une liste
    parseInt(body.list_id, 10)
  );

  if (!list) {
    return errorController._400(
      [
        "Invalid body parameter: could not find a List with provided 'list_id'"
      ],
      req,
      res
    );
  }
  
  // 3. je crée la carte en BDD 
  const { content, list_id, position, color } = body;
  const createdCard = await Card.create({
    content,
    list_id: parseInt(list_id, 10),
    position: position || 0,
    color: req.body.color || null,
  });
  
  // 4. je renvoie une 201 `CREATED` avec la carte créée en JSON
  res.status(201).json(createdCard);
}

async function updateCard(req, res) {
  // 1. je vais chercher la carte grâce à ma fonction utilitaire
  const card = await findOne(Card, req, res);
  
  if (!card) {
    return;
  }
  
  // 2. je valide mes données
  const { body } = req;

  const updateCardSchema = Joi.object({
    content: Joi.string().min(1),
    position: Joi.number().integer().min(0),
    color: Joi.string()
      .regex(/^#[0-9a-fA-F]{3,6}$/)
      .message("Property 'color' should be a valid hexadecimal code"),
    list_id: Joi.number().integer()
  }).min(1).message("Missing body parameters. Provide at least one of the following properties : content, position, color, list_id");

  const { error } = updateCardSchema.validate(body);
  if (error) {
    return errorController._400([error.message], req, res);
  }

  // 3. si on veut modifier l'ID de la liste
  // je vérifie que celle-ci existe
  // sinon erreur 400
  if (body.list_id && !(await exists(List, body.list_id))) {
    return errorController._400(
      [
        "Invalid body parameter: 'list_id' does not exist.",
      ],
      req, 
      res
    );
  }
    
  // 3. je mets à jour la carte
  // autre méthode → Model.update() = set + save
  const { content, list_id, position, color } = body;
  const updatedStatement = await Card.update(
    {
      // si content n'existe pas dans le body, j'indique l'ancien
      content: content || card.content,
      position: position || card.position,
      color: color || card.color,
      list_id: parseInt(list_id, 10) || card.list_id,
    },
    {
      where: { id: card.id },
    }
  );
  
  // 4. je renvoie la carte modifiée en JSON
  // `.update()` retourne le nombre de lignes modifiées
  if (!updatedStatement) {
    // si pas de modification, je retourne la carte actuelle
    res.json(card);
  }
  
  // je dois d'abord la récupérer…
  const updatedCard = await findOne(Card, req, res);
  res.json(updatedCard);
}

async function deleteCard(req, res) {
  const card = await findOne(Card, req, res);

  if (!card) {
    return;
  }
  
  await card.destroy();
  
  res.status(204).end();
}

export default {
  getAll,
  getAllByList,
  getOne,
  createCard,
  updateCard,
  deleteCard,
}
