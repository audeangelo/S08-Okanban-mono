/**
 * @file Contrôleur pour gérer les erreurs
 * 
 * @example
 * `return errorController._404(req, res);`
 * `return errorController._400(errors, req, res);`
 * `return errorController._500(error, req, res);`
 */
const errorController = {
  /*
    astuce pour bien nommer nos propriétés :

    - on s'évite de répéter `errorXXX` (`error400`, `error404`…)
    - on se simplifie l'appel
        → errorController['400'] imposé par les index numériques pas cool…

    → on préfixes nos propriétés par un `_`
    appel : errorController._404()
  */

  _400: (errors, req, res) => {
    res.status(400).json({
      type: 'Bad request',
      errors,
    });
  },

  _404: (req, res) => {
    res.status(404).json({
      type: 'Not found',
      error: 'Ressource not found. Please verify the provided ID.',
    });
  },

  _500: (error, req, res) => {
    // on utilise console.trace, histoire de savoir d'ou vient l'erreur
    // (fichier et numéro de ligne - très pratique !)
    console.trace(error);
    res.status(500).json({
      type: 'Internal Server Error',
      error: error.toString(),
    });
  },
};

export default errorController;
