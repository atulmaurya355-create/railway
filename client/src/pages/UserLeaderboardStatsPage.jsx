import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { leaderboardService } from '../features/leaderboard/leaderboardService.js';
import {
  Trophy,
  Flame,
  Target,
  Zap,
  TrendingUp,
  Award,
  BarChart3,
  Clock,
} from 'lucide-react';

export const UserLeaderboardStatsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [nearbyRanks, setNearbyRanks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsResponse, nearbyResponse] = await Promise.all([
          leaderboardService.getUserStats(),
          leaderboardService.getNearbyRanks(5),
        ]);

        setStats(statsResponse.data.stats);
        setNearbyRanks(nearbyResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400">
            {error || 'Unable to load your stats'}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Trophy,
      label: 'Global Rank',
      value: `#${stats.overallRank || 'N/A'}`,
      color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Rank',
      value: `#${stats.weeklyRank || 'N/A'}`,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      icon: Calendar,
      label: 'Monthly Rank',
      value: `#${stats.monthlyRank || 'N/A'}`,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    },
    {
      icon: Zap,
      label: 'Total Score',
      value: stats.totalScore.toLocaleString(),
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${stats.accuracy.toFixed(1)}%`,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    },
    {
      icon: BarChart3,
      label: 'Total XP',
      value: stats.totalXP.toLocaleString(),
      color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Performance
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your ranking and achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-lg p-6 ${card.color} backdrop-blur-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={24} />
                  <p className="text-sm font-medium">{card.label}</p>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Stats */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Overall Statistics
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">Total Tests</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalTests}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">Total Attempts</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalAttempts}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">Correct Answers</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.correctAnswers}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">Average Score</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.averageScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Badges Earned</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.badges.length}
                </span>
              </div>
            </div>
          </div>

          {/* Weekly/Monthly Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              This Period
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  This Week
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Score: {stats.weeklyScore}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tests: {stats.weeklyTests}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Accuracy: {stats.weeklyAccuracy.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  This Month
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded p-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Score: {stats.monthlyScore}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tests: {stats.monthlyTests}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Accuracy: {stats.monthlyAccuracy.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Last Activity
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {stats.lastActivityDate
                    ? new Date(stats.lastActivityDate).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Rankings */}
        {nearbyRanks && (
          <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Nearby Competitors
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nearbyRanks.nearbyRankers.map((ranker) => (
                    <tr
                      key={ranker._id}
                      className={`border-b border-slate-200 dark:border-slate-700 ${
                        ranker.userId._id === user._id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                        #{ranker.overallRank}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {ranker.userId?.name || 'Anonymous'}
                        {ranker.userId._id === user._id ? ' (You)' : ''}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {ranker.totalScore}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {ranker.accuracy?.toFixed(1) || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLeaderboardStatsPage;

import { Calendar } from 'lucide-react';
