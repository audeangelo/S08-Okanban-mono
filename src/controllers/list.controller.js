import Joi from 'joi';

import errorController from './error.controller.js';
import { findOne } from '../utils/index.js';
import { List } from '../models/index.js';

/* Test sécurité */
// const sequelize = require("../db");
// const { QueryTypes } = require("sequelize");

async function getAll(req, res) {
  // 1. je récupère toutes les listes depuis la BDD
  const lists = await List.findAll({
    include: {
      association: "cards",
      include: [
        {
          association: "tags",
          through: { attributes: [] },
        },
      ],
    },
    order: [
      ["position", "ASC"],
      ["created_at", "DESC"],
      ["cards", "position", "ASC"],
    ],
  });

  // 2. je renvoie les listes au client au format JSON
  res.json(lists);
}

async function getOne(req, res) {
  // 1. je vais chercher la liste grâce à ma fonction utilitaire
  const list = await findOne(List, req, res);
  // si je n'ai pas de liste en retour je ne vais pas plus loin…
  // je sors de la fonction (la réponse est traitée dans la fonction)
  if (!list) {
    return;
  }

  // 2. je renvoie la liste au client au format JSON
  res.json(list);
}

async function createList(req, res) {
  /* RÈGLE D'OR D'UNE API = NEVER TRUST USER INPUT ! */

  // 1. je récupère le corps de la requête
  const { name, position } = req.body;

  // 2. je valide mes données
  const bodyErrors = [];

  // si le titre est `undefined` ou _falsy_
  // OU si ce n'est pas un string
  // → erreur 400 `BAD REQUEST`

  if (!name || typeof name !== "string") {
    const error = name
      ? "Invalid type: 'name' should be a string"
      : "Missing body parameter: 'name'";

    bodyErrors.push(error);
  }

  // si la position (optionnelle) est fournie,
  // alors je vérifie que c'est un nombre valide
  //   ce n'est pas un entier
  //   OU est plus petit que 0
  // → erreur 400 `BAD REQUEST`
  if (position && (!Number.isInteger(position) || position < 0)) {
    bodyErrors.push(
      "Invalid type: 'position' should be a number greater than 0"
    );
  }

  if (bodyErrors.length) {
    return errorController._400(bodyErrors, req, res); // Bad request
  }

  // 3. je crée la liste en BDD
  const createdList = await List.create({
    name,
    position: position || 0,
  });

  // 4. je renvoie une 201 `CREATED` avec la liste créée en JSON
  res.status(201).json(createdList);
}

async function updateList(req, res) {
  // 1. je vais chercher la liste grâce à ma fonction utilitaire
  const list = await findOne(List, req, res);
  // si je n'ai pas de liste en retour je ne vais pas plus loin…
  // je sors de la fonction (la réponse est traitée dans la fonction)
  if (!list) {
    return;
  }

  // 2. je valide mes données
  // je vais passer par une librairie : https://github.com/hapijs/joi

  // 2.1. je récupère les données envoyées
  // (ne pas oublier le _body parser_)
  const { body } = req;
  // 2.2. je définis mon schéma de validation Joi
  // (je dois avoir au moins un des paramètres)
  const updateListSchema = Joi.object({
    name: Joi.string().min(1),
    position: Joi.number().integer().min(0),
  })
    .min(1)
    .message(
      "Missing body parameters. Provide at least 'name' or 'position' parameter"
    );
  // 2.3. je valide le body reçu
  const { value, error } = updateListSchema.validate(body);
  console.log("value: ", value);
  console.error("error: ", error);
  // 2.4. je gère les erreurs
  if (error) {
    return errorController._400([error.message], req, res);
  }

  // 3. je mets à jour la liste
  const { name, position } = body; // ou value (de Joi)
  // on ne change que les paramètres présents
  if (name) {
    list.name = name;
  }
  if (position) {
    list.position = position;
  }

  // je sauvegarde ma liste modifiée
  await list.save();

  // 4. je renvoie la liste modifiée en JSON
  res.json(list);
}

async function deleteList(req, res) {
  // 1. je vais chercher la liste grâce à ma fonction utilitaire
  const list = await findOne(List, req, res);
  // si je n'ai pas de liste en retour je ne vais pas plus loin…
  // je sors de la fonction (la réponse est traitée dans la fonction)
  if (!list) {
    return;
  }

  // 2. je supprimer la liste de la BDD
  await list.destroy();

  // 3. je termine la requête (pas de corps) → 204 `NO CONTENT`
  res.status(204).end();
}

// async function findOne(req, res) {
//   // 1. je récupère l'ID de la liste dans les paramètres
//   const listId = parseInt(req.params.id, 10);

//   // 2. si `id` n'est pas un nombre → erreur 400 `BAD REQUEST`
//   if (isNaN(listId)) {
//     const error = 'List ID should be a valid integer';
//     return errorController._400([error], req, res);
//   }

//   // 3. je récupère la liste dans la BDD
//   const list = await List.findByPk(listId);

//   // si elle n'y est pas → erreur 404 `NOT FOUND`
//   if (!list) {
//     return errorController._404(req, res);
//   }

//   // 4. je retourne la liste
//   return list;
// }

// async function query(req, res) {
//   // https://sequelize.org/docs/v6/core-concepts/raw-queries/
//   const query = `SELECT * FROM list WHERE id = ${req.params.id}`;
//   // SELECT * FROM list WHERE id = 2
//   // SELECT * FROM list WHERE id = 2;DROP TABLE card_has_tag; → double requête

//   const list = await sequelize.query(query, { type: QueryTypes.SELECT });

//   res.json(list);
// }

export default {
  getAll, // sucre syntaxique de `getAll: getAll`
  getOne,
  createList,
  updateList,
  deleteList,
  // query,
};
