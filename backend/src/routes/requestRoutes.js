import express from 'express';
import {
  createJoinRequest,
  getProjectRequests,
  getUserRequests,
  updateRequestStatus,
  cancelRequest,
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createJoinRequest);
router.get('/my-applications', protect, getUserRequests);
router.get('/project/:projectId', protect, getProjectRequests);
router.put('/:id', protect, updateRequestStatus);
router.delete('/:id', protect, cancelRequest);

export default router;
