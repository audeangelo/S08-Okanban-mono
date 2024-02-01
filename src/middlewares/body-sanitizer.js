import sanitizeHtml from 'sanitize-html';

const bodySanitizer = (req, res, next) => {
  // pour chaque propriété du BODY,
  // on nettoie les propriétés qui sont des string
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = sanitizeHtml(req.body[key], {
        allowedTags: [], // je refuse toutes les balises HTML
      });
    }
  });

  // puis on passe la main au middleware suivant
  next();
};

export default bodySanitizer;
