import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { healthRoutes } from '../modules/health/health.routes.js';
import { profileRoutes } from '../modules/profile/profile.routes.js';
import { quizRoutes } from '../modules/quiz/quiz.routes.js';
import { questionRoutes } from '../modules/questions/question.routes.js';
import { mockTestRoutes } from '../modules/mockTests/mockTest.routes.js';
import { aiTutorRoutes } from '../modules/aiTutor/aiTutor.routes.js';
import { previousPaperRoutes } from '../modules/previousPapers/previousPaper.routes.js';
import { studyMaterialRoutes } from '../modules/studyMaterials/studyMaterial.routes.js';
import { currentAffairsRoutes } from '../modules/currentAffairs/currentAffairs.routes.js';
import { leaderboardRoutes } from '../modules/leaderboard/leaderboard.routes.js';
import { notificationRoutes } from '../modules/notifications/notification.routes.js';
import { searchRoutes } from '../modules/search/search.routes.js';

export const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/health', healthRoutes);
apiRoutes.use('/profile', profileRoutes);
apiRoutes.use('/quiz', quizRoutes);
apiRoutes.use('/questions', questionRoutes);
apiRoutes.use('/mock-tests', mockTestRoutes);
apiRoutes.use('/ai-tutor', aiTutorRoutes);
apiRoutes.use('/previous-papers', previousPaperRoutes);
apiRoutes.use('/study-materials', studyMaterialRoutes);
apiRoutes.use('/current-affairs', currentAffairsRoutes);
apiRoutes.use('/leaderboard', leaderboardRoutes);
apiRoutes.use('/notifications', notificationRoutes);
apiRoutes.use('/search', searchRoutes);

