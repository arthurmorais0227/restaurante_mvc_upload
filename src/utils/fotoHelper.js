import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `aluno_${req.params.id}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });

export async function processarFoto(filePath) {
    try {
        console.log('Iniciando processamento da foto:', filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Arquivo não encontrado: ${filePath}`);
        }

        const stats = fs.statSync(filePath);
        console.log('Tamanho do arquivo:', stats.size, 'bytes');

        const processado = await sharp(filePath)
            .resize({ width: 800, withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();

        console.log('Imagem processada, tamanho final:', processado.length, 'bytes');

        // Escrever em um arquivo temporário primeiro
        const tempPath = filePath + '.tmp';
        fs.writeFileSync(tempPath, processado);

        // Depois mover para o arquivo original
        fs.renameSync(tempPath, filePath);

        const caminhoAbsoluto = path.resolve(filePath);

        console.log('Foto salva em:', caminhoAbsoluto);
        return caminhoAbsoluto;
    } catch (error) {
        console.error('Erro no processamento da foto:', error);
        throw error;
    }
}

export function removerFoto(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
