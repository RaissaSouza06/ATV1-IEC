import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { sequelize } from './config/database.js';
import appRoutes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota da documentação interativa do Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de verificacao de integridade
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', mensagem: 'Servidor operacional.' });
});

// Registra todas as rotas da aplicacao sob o prefixo /api
app.use('/api', appRoutes);

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexao com o banco de dados estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação do Swagger disponível em http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

main();