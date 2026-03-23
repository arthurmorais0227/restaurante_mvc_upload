import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Limpando banco...');

    await prisma.cardapio.deleteMany();
    await prisma.pedido.deleteMany();

    console.log('👤 Criando clientes...');

    const cliente1 = await prisma.pedido.create({
        data: {
            nome: 'João Silva',
            email: 'joao@email.com',
            telefone: '11999990001',
            cep: '13000-001',
            logradouro: 'Rua A',
            bairro: 'Centro',
            localidade: 'Campinas',
            uf: 'SP',
        },
    });

    const cliente2 = await prisma.pedido.create({
        data: {
            nome: 'Maria Souza',
            email: 'maria@email.com',
            telefone: '11999990002',
            cep: '13000-002',
            logradouro: 'Rua B',
            bairro: 'Cambuí',
            localidade: 'Campinas',
            uf: 'SP',
        },
    });

    const cliente3 = await prisma.pedido.create({
        data: {
            nome: 'Carlos Lima',
            email: 'carlos@email.com',
            telefone: '11999990003',
        },
    });

    const cliente4 = await prisma.pedido.create({
        data: {
            nome: 'Ana Oliveira',
            email: 'ana@email.com',
        },
    });

    const cliente5 = await prisma.pedido.create({
        data: {
            nome: 'Pedro Santos',
        },
    });

    const cliente6 = await prisma.pedido.create({
        data: {
            nome: 'Juliana Rocha',
            telefone: '11999990006',
        },
    });

    const cliente7 = await prisma.pedido.create({
        data: {
            nome: 'Fernando Alves',
            cep: '13000-007',
            localidade: 'Campinas',
            uf: 'SP',
        },
    });

    const cliente8 = await prisma.pedido.create({
        data: {
            nome: 'Patricia Gomes',
        },
    });

    const cliente9 = await prisma.pedido.create({
        data: {
            nome: 'Ricardo Martins',
        },
    });

    const cliente10 = await prisma.pedido.create({
        data: {
            nome: 'Camila Ferreira',
        },
    });

    console.log('🍽️ Criando itens do cardápio...');

    await prisma.cardapio.create({
        data: {
            nome: 'Hambúrguer',
            descricao: 'Hambúrguer artesanal',
            categoria: 'PRATO_PRINCIPAL',
            preco: 25.0,
            pedidoId: cliente1.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Pizza',
            descricao: 'Pizza de calabresa',
            categoria: 'PRATO_PRINCIPAL',
            preco: 45.0,
            pedidoId: cliente2.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Refrigerante',
            categoria: 'BEBIDA',
            preco: 8.0,
            pedidoId: cliente3.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Suco Natural',
            categoria: 'BEBIDA',
            preco: 10.0,
            pedidoId: cliente4.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Batata Frita',
            categoria: 'ENTRADA',
            preco: 15.0,
            pedidoId: cliente5.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Salada',
            categoria: 'ENTRADA',
            preco: 18.0,
            pedidoId: cliente6.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Lasanha',
            categoria: 'PRATO_PRINCIPAL',
            preco: 35.0,
            pedidoId: cliente7.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Sorvete',
            categoria: 'SOBREMESA',
            preco: 12.0,
            pedidoId: cliente8.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Café',
            categoria: 'BEBIDA',
            preco: 5.0,
            pedidoId: cliente9.id,
        },
    });

    await prisma.cardapio.create({
        data: {
            nome: 'Bolo de Chocolate',
            categoria: 'SOBREMESA',
            preco: 14.0,
            pedidoId: cliente10.id,
        },
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
