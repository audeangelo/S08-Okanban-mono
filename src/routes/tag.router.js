import { Router } from 'express';

import cw from '../controllers/controllerWrapper.js';
import tagController from '../controllers/tag.controller.js';

const router = new Router();

router.get('/tags', cw(tagController.getAll));
router.get('/tags/:id', cw(tagController.getOne));

router.post('/tags', cw(tagController.createTag));

router.patch('/tags/:id', cw(tagController.updateTag));

router.delete('/tags/:id', cw(tagController.deleteTag));

// on utilise le PUT ici pour ne pas créer une nouvelle entrée
// si le tag est déjà attaché à la carte
router.put('/cards/:cardId/tags/:tagId', cw(tagController.addTagToCard));
router.delete('/cards/:cardId/tags/:tagId', cw(tagController.removeTagFromCard));

export default router;
