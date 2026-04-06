import ClienteModel from '../models/ClienteModel.js';
import { gerarPdfCliente, gerarPdfTodos } from '../utils/pdfHelper.js';

export const relatorioTodos = async (req, res) => {
    try {
        const registros = await ClienteModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum relatório encontrado.' });
        }

        const pdf = await gerarPdfTodos(registros);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="clientes.pdf"',
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao gerar relatórios.' });
    }
};

export const relatorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const cliente = await ClienteModel.buscarPorId(parseInt(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdf = await gerarPdfCliente(cliente);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="clientes_${id}.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao gerar registro.' });
    }
};

export const listarPdfs = async (req, res) => {
    try {
        const clientes = await ClienteModel.buscarTodos();

        if (!clientes || clientes.length === 0) {
            return res.status(200).json({
                message: 'Nenhum cliente encontrado.',
                pdfs: [],
            });
        }

        const pdfs = clientes.map((cliente) => ({
            id: cliente.id,
            nome: cliente.nome,
            temFoto: !!(cliente.foto && cliente.foto.trim() !== ''),
            urlPdf: `${req.protocol}://${req.get('host')}/clientes/${cliente.id}/pdf`,
            criadoEm: cliente.createdAt || null,
        }));

        res.json({
            message: 'Lista de PDFs disponíveis',
            total: pdfs.length,
            pdfs: pdfs,
        });
    } catch (error) {
        console.error('Erro ao listar PDFs:', error);
        res.status(500).json({ error: 'Erro ao listar PDFs.' });
    }
};
