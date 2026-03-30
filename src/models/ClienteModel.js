import prisma from '../utils/prismaClient.js';
import { buscarEnderecoPorCep } from '../utils/cep.js';

export default class ClienteModel {
    constructor({
        nome,
        email = null,
        telefone = null,
        cep = null,
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
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    async criar() {
        if (!this.nome) {
            return { status: 400, error: 'Nome é obrigatório' };
        }

        if (this.nome.length < 3 || this.nome.length > 100) {
            return { status: 400, error: 'O nome deve ter entre 3 e 100 caracteres.' };
        }

        // Formatar CEP para XXXXX-XXX
        let cepFormatado = this.cep;
        if (this.cep) {
            const cepNumeros = this.cep.toString().replace(/\D/g, '');
            if (cepNumeros.length === 8) {
                cepFormatado = `${cepNumeros.slice(0, 5)}-${cepNumeros.slice(5)}`;
            }
        }

        let endereco = {};
        if (cepFormatado) {
            try {
                endereco = await buscarEnderecoPorCep(cepFormatado);
            } catch (error) {
                console.warn('Não foi possível buscar o endereço pelo CEP:', error.message);
            }
        }

        return prisma.cliente.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: cepFormatado,
                logradouro: endereco.logradouro || this.logradouro,
                bairro: endereco.bairro || this.bairro,
                localidade: endereco.localidade || this.localidade,
                uf: endereco.uf || this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        // Formatar CEP para XXXXX-XXX
        let cepFormatado = this.cep;
        if (this.cep) {
            const cepNumeros = this.cep.toString().replace(/\D/g, '');
            if (cepNumeros.length === 8) {
                cepFormatado = `${cepNumeros.slice(0, 5)}-${cepNumeros.slice(5)}`;
            }
        }

        let endereco = {};
        if (cepFormatado) {
            try {
                endereco = await buscarEnderecoPorCep(cepFormatado);
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
                cep: cepFormatado,
                logradouro: endereco.logradouro || this.logradouro,
                bairro: endereco.bairro || this.bairro,
                localidade: endereco.localidade || this.localidade,
                uf: endereco.uf || this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        if (this.ativo === false) {
            throw new Error('Não é possível deletar um cliente inativo.');
        }

        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }
        if (filtros.telefone) {
            where.telefone = { contains: filtros.telefone, mode: 'insensitive' };
        }

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new ClienteModel(data);
    }
}
