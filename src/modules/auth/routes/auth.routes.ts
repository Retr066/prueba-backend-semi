import { Router } from 'express';
import { register, login, refreshToken } from '@modules/auth/controllers/auth.controller';
import { validateLogin, validateRegister } from 'src/modules/auth/middlewares/validators';

const router = Router();

router.post('/register',validateRegister, register);
router.post('/login',validateLogin, login);

router.post('/refresh-token', refreshToken);

export default router;
