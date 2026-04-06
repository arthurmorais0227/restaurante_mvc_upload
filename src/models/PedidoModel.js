import prisma from '../utils/prismaClient.js';

export default class ExemploModel {
    constructor({ id = null, nome = null, descricao = true, disponivel = null, preco = null, foto = null, clienteId = null } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.disponivel = disponivel;
        this.preco = preco;
        this.foto = foto;
        this.clienteId = clienteId;
    }

    async criar() {
        return prisma.exemplo.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                disponivel: this.disponivel,
                preco: new Prisma.Decimal(this.preco),
                foto:this.foto,
                clienteId:this.clienteId
            },
        });
    }

    async atualizar() {
        return prisma.exemplo.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                disponivel: this.disponivel,
                preco: new Prisma.Decimal(this.preco),
                foto: this.foto
            },


        });
    }

    async deletar() {
        return prisma.pedido.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.estado !== undefined) {
            where.disponivel = filtros.disponivel === 'true';
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }

        return prisma.exemplo.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.pedido.findUnique({
            where: { id },
            include: {cliente:true}
        });

        return data ? new PedidoModel(data) : null;
    }
}
