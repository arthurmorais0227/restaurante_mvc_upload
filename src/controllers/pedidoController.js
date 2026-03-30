import pedidoModel from '../models/PedidoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, categoria, disponivel, preco} = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        if (disponivel !== true){
        return res.status(400).json({ error:'O campo "disponivel" precisa ser true'})
        }

        const pedido = new pedidoModel({ nome, preco: parseFloat(preco),categoria,disponivel });
        const data = await pedido.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await pedidoModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.json({ data: pedido });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            pedido.nome = req.body.nome;
        }
        if (req.body.estado !== undefined) {
            pedido.estado = req.body.estado;
        }
        if (req.body.preco !== undefined) {
            pedido.preco = parseFloat(req.body.preco);
        }

        const data = await pedido.atualizar();

        return res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const pedido = await pedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await pedido.deletar();

        return res.json({ message: `O registro "${pedido.nome}" foi deletado com sucesso!`, deletado: pedido });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
