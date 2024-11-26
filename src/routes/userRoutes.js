import express from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.get('/users', auth, getUsers);
router.post('/users', auth, createUser);
router.get('/users/:id', auth, getUserById);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);

export default router;