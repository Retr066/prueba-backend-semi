import { authMiddleware } from "@shared/middlewares/auth.middleware";
import { Router } from "express";
import { deleteUser, getUserById, getUsers, getUsersSecond, updateUser } from "../controllers/user.controller";
import { adminMiddleware } from "@shared/middlewares/admin.middleware";
import { validateUpdateUser } from "../middlewares/validators";

const router = Router();


router.get('/admin', authMiddleware,adminMiddleware, getUsersSecond);
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateUpdateUser, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
