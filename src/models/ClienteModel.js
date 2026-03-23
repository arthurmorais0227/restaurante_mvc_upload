import prisma from '../utils/prismaClient.js';
import { buscarEnderecoPorCep } from '../utils/cep.js';

export default class ClienteModel {
    constructor({
        nome,
        email = null,
        telefone = null,
        cep = null,
        endereco = null,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true,
    } = {}) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.endereco = endereco;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    async criar() {

        if (!nome)


        let endereco = {};
        if (this.cep) {
            try {
                endereco = await buscarEnderecoPorCep(this.cep);
            } catch (error) {
                console.warn('Não foi possível buscar o endereço pelo CEP:', error.message);
            }
        }

        return prisma.cliente.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                endreco: this.endereco,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        let endereco = {};
        if (this.cep) {
            try {
                endereco = await buscarEnderecoPorCep(this.cep);
            } catch (error) {
                console.warn('Não foi possível buscar o endereço pelo CEP:', error.message);
            }
        }

        return prisma.cliente.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: endereco.logradouro || this.logradouro,
                bairro: endereco.bairro || this.bairro,
                localidade: endereco.localidade || this.localidade,
                uf: endereco.uf || this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true';
        }
        if (filtros.telefone) {
            where.telefone = { contains: filtros.telefone, mode: 'insensitive' };
        }

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.telefone.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new ClienteModel(data);
    }
}
