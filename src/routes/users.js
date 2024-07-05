import { Router } from 'express';
import { getUser } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/:id', auth, getUser);

export default router;