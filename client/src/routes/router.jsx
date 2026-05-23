import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../features/auth/components/AuthLayout.jsx';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.jsx';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage.jsx';
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage.jsx';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { QuizPage } from '../pages/QuizPage.jsx';
import { MockTestPage } from '../pages/MockTestPage.jsx';
import { AiTutorPage } from '../pages/AiTutorPage.jsx';
import { PreviousPapersPage } from '../pages/PreviousPapersPage.jsx';
import { StudyMaterialsPage } from '../pages/StudyMaterialsPage.jsx';
import { CurrentAffairsPage } from '../pages/CurrentAffairsPage.jsx';
import { CurrentAffairsDetailPage } from '../pages/CurrentAffairsDetailPage.jsx';
import { CurrentAffairsQuizPage } from '../pages/CurrentAffairsQuizPage.jsx';
import { CurrentAffairsAdmin } from '../pages/CurrentAffairsAdmin.jsx';
import { LeaderboardPage } from '../pages/LeaderboardPage.jsx';
import { UserLeaderboardStatsPage } from '../pages/UserLeaderboardStatsPage.jsx';
import { AnalyticsPage } from '../pages/AnalyticsPage.jsx';
import { AchievementsPage } from '../pages/AchievementsPage.jsx';
import { StudyPlanPage } from '../pages/StudyPlanPage.jsx';
import { NotesPage } from '../pages/NotesPage.jsx';
import { BookmarksPage } from '../pages/BookmarksPage.jsx';
import { RecommendationsPage } from '../pages/RecommendationsPage.jsx';
import { WeakTopicsPage } from '../pages/WeakTopicsPage.jsx';
import { RevisionPlannerPage } from '../pages/RevisionPlannerPage.jsx';
import { AdminPage } from '../pages/AdminPage.jsx';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'achievements',
        element: (
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'study-plan',
        element: (
          <ProtectedRoute>
            <StudyPlanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes',
        element: (
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookmarks',
        element: (
          <ProtectedRoute>
            <BookmarksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'recommendations',
        element: (
          <ProtectedRoute>
            <RecommendationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'weak-topics',
        element: (
          <ProtectedRoute>
            <WeakTopicsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'revisions',
        element: (
          <ProtectedRoute>
            <RevisionPlannerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },

      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'quiz',
        element: (
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mock-tests',
        element: (
          <ProtectedRoute>
            <MockTestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'ai-tutor',
        element: (
          <ProtectedRoute>
            <AiTutorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'previous-papers',
        element: (
          <ProtectedRoute>
            <PreviousPapersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'study-materials',
        element: (
          <ProtectedRoute>
            <StudyMaterialsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'current-affairs',
        element: <CurrentAffairsPage />,
      },
      {
        path: 'current-affairs/:id',
        element: <CurrentAffairsDetailPage />,
      },
      {
        path: 'current-affairs/quiz',
        element: (
          <ProtectedRoute>
            <CurrentAffairsQuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'current-affairs/quiz/:quizId',
        element: (
          <ProtectedRoute>
            <CurrentAffairsQuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/current-affairs',
        element: (
          <ProtectedRoute>
            <CurrentAffairsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'leaderboard/stats',
        element: (
          <ProtectedRoute>
            <UserLeaderboardStatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPasswordPage />,
      },
      {
        path: '/verify-email/:token',
        element: <VerifyEmailPage />,
      },
    ],
  },
]);
