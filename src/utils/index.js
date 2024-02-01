import errorController from '../controllers/error.controller.js';

async function findOne(Model, req, res, options = {}) {
  // 1. je récupère l'ID  dans les paramètres
  const id = parseInt(req.params.id, 10);

  // 2. si `id` n'est pas un nombre → erreur 400 `BAD REQUEST`
  if (isNaN(id)) {
    const error = `${Model.name} ID should be a valid integer`;
    return errorController._400([error], req, res);
  }

  // 3. je récupère la ressource dans la BDD
  const data = await Model.findByPk(id, options);

  // si elle n'y est pas → erreur 404 `NOT FOUND`
  if (!data) {
    return errorController._404(req, res);
  }

  // 4. je retourne la ressource
  return data;
}

async function exists(Model, searchId) {
  const data = await Model.findByPk(searchId);

  /*
    je veux retourner un booléen

    - si `data` vaut `null`, renvoie `false`
    - si `data` est un objet (la ressource existe), renvoie `true`

    j'utilise le « Logical NOT (!) operator » qui prend la valeur
    logique (booléenne) opposée (true si falsy, false si truthy)

    j'en met 2 à la suite pour transformer n'importe quelle valeur
    en sa valeur logique (l'opposé logique de l'opposé logique)

    → https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Logical_NOT#double_non_!!
  */
  return !!data;
}

export {
  findOne,
  exists,
};
