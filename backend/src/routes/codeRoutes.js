import express from 'express';
import { executeCode } from '../controllers/codeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/run', protect, executeCode);

export default router;
