import { Router } from 'express';

import cw from '../controllers/controllerWrapper.js';
import cardController from '../controllers/card.controller.js';

const router = new Router();

router.get('/cards', cw(cardController.getAll));
router.get('/cards/:id', cw(cardController.getOne));
router.get('/lists/:id/cards', cw(cardController.getAllByList));

router.post('/cards', cw(cardController.createCard));

router.patch('/cards/:id', cw(cardController.updateCard));

router.delete('/cards/:id', cw(cardController.deleteCard));

export default router;
