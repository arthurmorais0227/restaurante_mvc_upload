import express from 'express';
import * as controller from '../controllers/pedidoController.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.post('/pedidos', autenticar, controller.criar);
router.get('/pedidos', autenticar, controller.buscarTodos);
router.get('/pedidos/:id', autenticar, controller.buscarPorId);
router.put('/pedidos/:id', autenticar, controller.atualizar);
router.delete('/pedidos/:id', autenticar, controller.deletar);

export default router;
