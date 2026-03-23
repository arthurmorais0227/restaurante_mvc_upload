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

    await prisma.pedido.deleteMany();
    await prisma.cliente.deleteMany();

    console.log('👤 Criando clientes...');

    const cliente1 = await prisma.cliente.create({
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

    const cliente2 = await prisma.cliente.create({
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

    const cliente3 = await prisma.cliente.create({
        data: {
            nome: 'Carlos Lima',
            email: 'carlos@email.com',
            telefone: '11999990003',
        },
    });

    const cliente4 = await prisma.cliente.create({
        data: {
            nome: 'Ana Oliveira',
            email: 'ana@email.com',
        },
    });

    const cliente5 = await prisma.cliente.create({
        data: {
            nome: 'Pedro Santos',
        },
    });

    const cliente6 = await prisma.cliente.create({
        data: {
            nome: 'Juliana Rocha',
            telefone: '11999990006',
        },
    });

    const cliente7 = await prisma.cliente.create({
        data: {
            nome: 'Fernando Alves',
            cep: '13000-007',
            localidade: 'Campinas',
            uf: 'SP',
        },
    });

    const cliente8 = await prisma.cliente.create({
        data: {
            nome: 'Patricia Gomes',
        },
    });

    const cliente9 = await prisma.cliente.create({
        data: {
            nome: 'Ricardo Martins',
        },
    });

    const cliente10 = await prisma.cliente.create({
        data: {
            nome: 'Camila Ferreira',
        },
    });

    console.log('📦 Criando pedidos...');

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 1',
            descricao: 'Pedido simples',
            categoria: 'ONLINE',
            preco: 25.0,
            clienteId: cliente1.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 2',
            descricao: 'Pedido grande',
            categoria: 'DELIVERY',
            preco: 45.0,
            clienteId: cliente2.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 3',
            categoria: 'PRESENCIAL',
            preco: 8.0,
            clienteId: cliente3.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 4',
            categoria: 'ONLINE',
            preco: 10.0,
            clienteId: cliente4.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 5',
            categoria: 'RETIRADA',
            preco: 15.0,
            clienteId: cliente5.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 6',
            categoria: 'DELIVERY',
            preco: 18.0,
            clienteId: cliente6.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 7',
            categoria: 'PRESENCIAL',
            preco: 35.0,
            clienteId: cliente7.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 8',
            categoria: 'ONLINE',
            preco: 12.0,
            clienteId: cliente8.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 9',
            categoria: 'DELIVERY',
            preco: 5.0,
            clienteId: cliente9.id,
        },
    });

    await prisma.pedido.create({
        data: {
            nome: 'Pedido 10',
            categoria: 'RETIRADA',
            preco: 14.0,
            clienteId: cliente10.id,
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
