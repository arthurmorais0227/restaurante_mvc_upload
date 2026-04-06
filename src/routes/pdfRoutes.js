import express from 'express';
import * as controller from '../controllers/pdfController.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.get('/:id/pdf', autenticar, controller.relatorioPorId);
router.get('/pdf', autenticar, controller.relatorioTodos);
router.get('/pdfs', autenticar, controller.listarPdfs);

export default router;
