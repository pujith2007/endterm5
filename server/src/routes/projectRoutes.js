import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getRecommendedProjects,
} from '../controllers/projectController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Specific routes before :id
router.get('/my-projects', protect, getMyProjects);
router.get('/recommendations', protect, getRecommendedProjects);

// General list & create
router.route('/')
  .get(optionalAuth, getProjects)
  .post(protect, createProject);

// Single project detail, update, delete
router.route('/:id')
  .get(optionalAuth, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
