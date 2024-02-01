import { readFile } from 'node:fs/promises';
import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';

import { listRouter, cardRouter, tagRouter } from './routes/index.js';

// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const swaggerJson = await readFile(new URL('./swagger.json', import.meta.url));
const swaggerDocument = JSON.parse(swaggerJson);

const router = new Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/', (req, res) => {
  res.json({
    hello: 'Welcome to the oKanban API.'
  });
});

// j'utilise le routeur dédié aux Listes
router.use(listRouter);
router.use(cardRouter);
router.use(tagRouter);

export default router;
