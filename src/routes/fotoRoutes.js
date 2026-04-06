import express from 'express';
import * as controller from '../controllers/fotoController.js';
import { upload } from '../utils/fotoHelper.js';
import autenticar from '../utils/apiKey.js';

const router = express.Router();

router.post('/:id/foto', autenticar, upload.single('foto'), controller.uploadFoto);
router.get('/:id/foto', autenticar, controller.verFoto);

export default router;
