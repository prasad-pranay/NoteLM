import { Router } from 'express';
import { getUserStats, getPerformanceTrends, getDashboardData } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/stats', getUserStats);
router.get('/trends', getPerformanceTrends);
router.get('/dashboard', getDashboardData);

export default router;
