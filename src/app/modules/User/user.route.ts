import express from 'express';
import { userController } from './user.controller';


const router = express.Router();

router.get("/", userController.getAllUsers);   
router.get('/:id', userController.getUserById);

export const userRoutes = router;