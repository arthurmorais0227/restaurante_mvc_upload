import express from 'express';
import * as controller from '../controllers/clienteController.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.post('/', autenticar, controller.criar);
router.get('/', autenticar, controller.buscarTodos);
router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.deletar);

export default router;
