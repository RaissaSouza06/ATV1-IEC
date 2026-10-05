import { Router } from 'express';
import tarefaRoutes from './tarefaRoutes';

const router = Router();

// Registo das rotas da entidade principal (Tarefas)
router.use('/tarefas', tarefaRoutes);

export default router;
