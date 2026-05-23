import { useEffect, useState } from 'react';
import { Trophy, Flame, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { leaderboardService } from '../features/leaderboard/leaderboardService.js';
import { LeaderboardTable } from './LeaderboardTable.jsx';

const LEADERBOARD_TYPES = [
  {
    id: 'global',
    label: 'Global Ranking',
    icon: Trophy,
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'weekly',
    label: 'Weekly Ranking',
    icon: TrendingUp,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'monthly',
    label: 'Monthly Ranking',
    icon: Calendar,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'highest',
    label: 'Highest Scores',
    icon: Award,
    color: 'from-red-400 to-orange-500',
  },
  {
    id: 'streak',
    label: 'Streak Leaders',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'accuracy',
    label: 'Accuracy Kings',
    icon: Target,
    color: 'from-green-400 to-emerald-500',
  },
];

import { Calendar } from 'lucide-react';

export const LeaderboardPage = () => {
  const [activeLeaderboard, setActiveLeaderboard] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [sortBy, setSortBy] = useState('rank');
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        let response;

        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy,
        };

        switch (activeLeaderboard) {
          case 'global':
            response = await leaderboardService.getGlobalLeaderboard(params);
            break;
          case 'weekly':
            response = await leaderboardService.getWeeklyLeaderboard(params);
            break;
          case 'monthly':
            response = await leaderboardService.getMonthlyLeaderboard(params);
            break;
          case 'highest':
            response = await leaderboardService.getHighestScores(params);
            break;
          case 'streak':
            response = await leaderboardService.getStreakLeaderboard(params);
            break;
          case 'accuracy':
            response = await leaderboardService.getAccuracyLeaderboard(params);
            break;
          default:
            response = await leaderboardService.getGlobalLeaderboard(params);
        }

        setLeaderboardData(response.data.leaderboard);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeLeaderboard, pagination.page, sortBy]);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const response = await leaderboardService.getTopPerformers({
          limit: 5,
        });
        setTopPerformers(response.data);
      } catch (err) {
        console.error('Error fetching top performers:', err);
      }
    };

    fetchTopPerformers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            🏆 Leaderboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Compete with learners worldwide and climb the rankings
          </p>
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topPerformers.slice(0, 3).map((performer, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={performer._id}
                  className={`bg-gradient-to-br ${
                    idx === 0
                      ? 'from-yellow-400 to-yellow-500'
                      : idx === 1
                      ? 'from-slate-300 to-slate-400'
                      : 'from-orange-300 to-orange-400'
                  } rounded-lg p-6 text-white shadow-lg`}
                >
                  <div className="text-4xl mb-2">{medals[idx]}</div>
                  <p className="text-sm opacity-90 mb-1">
                    {idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : '3rd Place'}
                  </p>
                  <h3 className="text-2xl font-bold mb-2">
                    {performer.userId?.name || 'Anonymous'}
                  </h3>
                  <p className="text-lg font-semibold">
                    {performer.totalScore.toLocaleString()} Points
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Type Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {LEADERBOARD_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setActiveLeaderboard(type.id);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg font-medium transition-all ${
                    activeLeaderboard === type.id
                      ? `bg-gradient-to-br ${type.color} text-white shadow-lg`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm text-center">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setSortBy('rank')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'rank'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            By Rank
          </button>
          <button
            onClick={() => setSortBy('score')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'score'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            By Score
          </button>
          <button
            onClick={() => setSortBy('accuracy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'accuracy'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            By Accuracy
          </button>
          <button
            onClick={() => setSortBy('tests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'tests'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            By Tests
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Leaderboard Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <LeaderboardTable
              data={leaderboardData}
              leaderboardType={activeLeaderboard}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.max(1, pagination.page - 1),
                    })
                  }
                  disabled={pagination.page === 1}
                  className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-slate-700 dark:text-slate-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
