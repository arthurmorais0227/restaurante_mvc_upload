import ClienteModel from '../models/ClienteModel.js';
import fs from 'fs/promises';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
        }

        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'O id enviado não é válido' });

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            removerFoto(req.file.path);
            return res.status(400).json({ error: 'O cliente não possui registro.' });
        }

        if (cliente.foto) {
            try {
                await fs.unlink(cliente.foto);
            } catch (error) {
                console.warn('Erro ao remover foto anterior:', error.message);
            }
        }

        try {
            cliente.foto = await processarFoto(req.file.path);
        } catch (error) {
            console.error('Erro no processamento da foto:', error);
            removerFoto(req.file.path);
            return res.status(500).json({ error: 'Erro ao processar a foto.' });
        }

        try {
            await cliente.atualizar();
        } catch (error) {
            console.error('Erro na atualização do banco:', error);
            // Tentar remover a foto processada se a atualização falhar
            try {
                if (cliente.foto) await fs.unlink(cliente.foto);
            } catch (e) {
                console.warn('Erro ao remover foto após falha:', e.message);
            }
            return res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
        }

        return res.status(200).json({
            message: 'Foto salva com sucesso',
            data: {
                id: cliente.id,
                nome: cliente.nome,
                foto: cliente.foto,
            },
        });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        res.status(500).json({ error: 'Erro interno ao salvar a foto do cliente.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Erro ao buscar foto do cliente' });
        }
        if (!cliente.foto) {
            return res.status(400).json({
                error: 'Este cliente não tem fotos registradas',
            });
        }

        res.sendFile(cliente.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        res.status(500).json({ error: 'Erro ao buscar foto.' });
    }
};
