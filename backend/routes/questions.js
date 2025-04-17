
import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all questions
router.get('/', protect, getQuestions);

// Create question
router.post('/', protect, admin, createQuestion);

// Get question by ID
router.get('/:id', protect, getQuestionById);

// Update question
router.put('/:id', protect, admin, updateQuestion);

// Delete question
router.delete('/:id', protect, admin, deleteQuestion);

export default router;
