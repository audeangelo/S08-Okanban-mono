import { Router } from 'express';

import cw from '../controllers/controllerWrapper.js';
import listController from '../controllers/list.controller.js';

const router = new Router();

router.get("/lists", cw(listController.getAll));
router.get("/lists/:id", cw(listController.getOne));

router.post("/lists", cw(listController.createList));

router.patch("/lists/:id", cw(listController.updateList));

router.delete("/lists/:id", cw(listController.deleteList));

/* Test sécurité */
router.get("/query/:id", cw(listController.query));

export default router;
