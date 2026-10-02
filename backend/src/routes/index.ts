import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Registra as rotas de usuarios sob o prefixo /users
router.use('/users', userRoutes);

export default router;