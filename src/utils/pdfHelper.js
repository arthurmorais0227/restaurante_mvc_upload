import htmlPdf from 'html-pdf-node';
import fs from 'fs';

export async function gerarPdfCliente(cliente) {
    let fotoHtml = '<em>Sem foto</em>';

    if (cliente.foto && fs.existsSync(cliente.foto)) {
        try {
            const base64 = fs.readFileSync(cliente.foto).toString('base64');
            fotoHtml = `<img src="data:image/jpeg;base64,${base64}" width="120" style="border: 1px solid #ccc; border-radius: 5px;" />`;
        } catch (error) {
            console.warn('Erro ao carregar foto para PDF:', error.message);
            fotoHtml = '<em>Erro ao carregar foto</em>';
        }
    }

    const html = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .info { margin: 10px 0; }
            .foto { margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>Relatório do Cliente</h1>

        <div class="foto">
            <strong>Foto:</strong><br>
            ${cliente.foto}
        </div>

        <div class="info">
            <strong>Nome:</strong> ${cliente.nome}
        </div>

        <div class="info">
            <strong>Email:</strong> ${cliente.email || '-'}
        </div>

        <div class="info">
            <strong>Telefone:</strong> ${cliente.telefone || '-'}
        </div>

        <div class="info">
            <strong>CEP:</strong> ${cliente.cep || '-'}
        </div>

        <div class="info">
            <strong>Endereço:</strong> ${cliente.logradouro || '-'}, ${cliente.bairro || '-'} - ${cliente.localidade || '-'} / ${cliente.uf || '-'}
        </div>
    </body>
    </html>
    `;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}

export async function gerarPdfTodos(clientes) {
    const linhas = clientes
        .map(
            (c) => `
            <tr>
                <td>${c.id}</td>
                <td>${c.nome || '-'}</td>
                <td>${c.email || '-'}</td>
                <td>${c.telefone || '-'}</td>
                <td>${c.cep || '-'}</td>
                <td>${c.localidade || '-'}/${c.uf || '-'}</td>
                <td>${c.ativo ? 'Ativo' : 'Inativo'}</td>
            </tr>`,
        )
        .join('');

    const html = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total { text-align: center; margin-top: 20px; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Relatório de Clientes</h1>

        <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CEP</th>
                <th>Cidade/UF</th>
                <th>Status</th>
            </tr>
            ${linhas}
        </table>

        <div class="total">
            Total: ${clientes.length} cliente(s)
        </div>
    </body>
    </html>`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}
