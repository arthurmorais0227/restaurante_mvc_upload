import express from 'express';
import 'dotenv/config';
import clienteRoutes from './routes/clienteRoutes.js';
import pedidoRoutes from './routes/pedidoRoute.js';
import fotoRoutes from './routes/fotoRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/clientes', pedidoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/clientes', fotoRoutes);
app.use('/clientes', pdfRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
