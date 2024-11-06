import { Router } from 'express';
import GoodsController from './controller.js';

const GoodsRouter = Router();

// CRUD
GoodsRouter.get('/api/goods/:id', GoodsController.getGoodsById);
GoodsRouter.get('/api/goods', GoodsController.getAllGoods);
GoodsRouter.post('/api/goods', GoodsController.createGoods);
GoodsRouter.patch('/api/goods/:id', GoodsController.updateGoods);
GoodsRouter.delete('/api/goods/:id', GoodsController.deleteGoods);

export default GoodsRouter;
