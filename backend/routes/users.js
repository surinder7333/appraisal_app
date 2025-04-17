import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTeamMembers,
  getUserRelationships
} from '../controllers/userController.js';
import { protect, admin, manager } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', protect, admin, getUsers);

// Create user
router.post('/', protect, admin, createUser);

// Get team members for a manager
router.get('/manager/:id/team', protect, manager, getTeamMembers);

// Get user relationships
router.get('/:id/relationships', protect, getUserRelationships);

// Get user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, admin, updateUser);

// Delete user
router.delete('/:id', protect, admin, deleteUser);

export default router;
