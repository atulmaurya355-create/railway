import { Link } from 'react-router-dom';
import { Medal, TrendingUp, Target, Zap } from 'lucide-react';

export const LeaderboardTable = ({ data, leaderboardType }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const renderRankCell = (entry) => {
    const rank = entry.overallRank || entry.weeklyRank || entry.monthlyRank;
    const badge = getRankBadge(rank);

    return (
      <div className="flex items-center gap-2">
        {badge && <span className="text-xl">{badge}</span>}
        <span className="font-bold text-lg text-slate-900 dark:text-white">#{rank}</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Accuracy
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tests
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                XP
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr
                key={entry._id}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-6 py-4">{renderRankCell(entry)}</td>
                <td className="px-6 py-4">
                  <Link to={`/profile/${entry.userId?._id}`} className="flex items-center gap-3 hover:underline">
                    {entry.userId?.avatarUrl ? (
                      <img
                        src={entry.userId.avatarUrl}
                        alt={entry.userId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {entry.userId?.name?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {entry.userId?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.userId?.examTarget || 'RRB Exam'}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {leaderboardType === 'weekly'
                        ? entry.weeklyScore.toLocaleString()
                        : leaderboardType === 'monthly'
                        ? entry.monthlyScore.toLocaleString()
                        : entry.totalScore.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-green-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {(
                        leaderboardType === 'weekly'
                          ? entry.weeklyAccuracy
                          : leaderboardType === 'monthly'
                          ? entry.monthlyAccuracy
                          : entry.accuracy
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {leaderboardType === 'weekly'
                        ? entry.weeklyTests
                        : leaderboardType === 'monthly'
                        ? entry.monthlyTests
                        : entry.totalAttempts}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Medal size={16} className="text-purple-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {entry.totalXP.toLocaleString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <Medal size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            No leaderboard data available
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
