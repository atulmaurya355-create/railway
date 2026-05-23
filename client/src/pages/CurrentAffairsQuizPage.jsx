import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, ChevronRight, BookOpenCheck, Target } from 'lucide-react';
import { currentAffairsService } from '../features/currentAffairs/currentAffairsService.js';
import { CurrentAffairsQuizAttempt } from './CurrentAffairsQuizAttempt.jsx';

const QUIZ_TYPES = [
  { id: 'daily', label: 'Daily', icon: Clock },
  { id: 'weekly', label: 'Weekly', icon: BookOpenCheck },
  { id: 'monthly', label: 'Monthly', icon: Target },
];

export const CurrentAffairsQuizPage = () => {
  const { quizId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('daily');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 15 });
  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    if (quizId) {
      // If viewing a specific quiz
      const fetchQuiz = async () => {
        try {
          setLoading(true);
          const response = await currentAffairsService.getQuizById(quizId);
          setSelectedQuiz(response.data.quiz);
          setError(null);
        } catch (err) {
          setError('Failed to load quiz');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    } else {
      // List quizzes
      fetchQuizzes();
      fetchUserHistory();
    }
  }, [quizId, selectedType]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = {
        quizType: selectedType,
        limit: pagination.limit,
        page: pagination.page,
      };
      const response = await currentAffairsService.getQuizzesByType(selectedType, params);
      setQuizzes(response.data.quizzes);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const response = await currentAffairsService.getQuizHistory({
        quizType: selectedType,
        limit: 5,
      });
      setUserHistory(response.data.attempts);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  if (selectedQuiz && quizId) {
    return <CurrentAffairsQuizAttempt quiz={selectedQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Current Affairs Quiz
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test your knowledge on the latest current affairs topics
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {QUIZ_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setPagination({ ...pagination, page: 1 });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <type.icon size={18} />
              {type.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Available Quizzes
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : quizzes.length > 0 ? (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz._id}
                    to={`/current-affairs/quiz/${quiz._id}`}
                    className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="text-slate-400 flex-shrink-0" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                          Questions
                        </p>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          {quiz.questions?.length || 0}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-3">
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                          Duration
                        </p>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          {quiz.duration} min
                        </p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-3">
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                          Marks
                        </p>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          {quiz.totalMarks}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>{quiz.attempts || 0} attempts</span>
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <BookOpenCheck size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No quizzes available for {selectedType} current affairs
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.max(1, pagination.page - 1),
                    })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              {userHistory.length > 0 ? (
                <div className="space-y-3">
                  {userHistory.map((attempt) => (
                    <Link
                      key={attempt._id}
                      to={`/current-affairs/attempts/${attempt._id}`}
                      className="block p-3 bg-slate-50 dark:bg-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {attempt.quizId?.title}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {attempt.percentage.toFixed(1)}%
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            attempt.isPassed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {attempt.isPassed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No quiz attempts yet
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Read questions carefully</li>
                <li>• Manage your time wisely</li>
                <li>• Review answers before submitting</li>
                <li>• Learn from explanations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsQuizPage;
