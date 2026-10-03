import { Router } from 'express';
import { TarefasController } from '../controllers/TarefasController';

const router = Router();

router.get('/', TarefasController.index);
router.get('/:id', TarefasController.show);
router.post('/', TarefasController.create);
router.put('/:id', TarefasController.update);
router.delete('/:id', TarefasController.delete);

export default router;