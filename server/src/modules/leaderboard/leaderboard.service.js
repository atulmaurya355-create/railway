import { ApiError } from '../../utils/apiError.js';
import { LeaderboardStats } from './leaderboardStats.model.js';
import { MockTestAttempt } from '../mockTests/mockTestAttempt.model.js';


export async function getGlobalLeaderboard(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const sortField = {
    rank: { overallRank: 1 },
    score: { totalScore: -1 },
    accuracy: { accuracy: -1 },
    tests: { totalAttempts: -1 },
  }[filters.sortBy] || { overallRank: 1 };

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find()
      .populate('userId', 'name avatarUrl email examTarget')
      .sort(sortField)
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWeeklyLeaderboard(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const sortField = {
    rank: { weeklyRank: 1 },
    score: { weeklyScore: -1 },
    accuracy: { weeklyAccuracy: -1 },
    tests: { weeklyTests: -1 },
  }[filters.sortBy] || { weeklyRank: 1 };

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find()
      .populate('userId', 'name avatarUrl email examTarget')
      .sort(sortField)
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getMonthlyLeaderboard(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const sortField = {
    rank: { monthlyRank: 1 },
    score: { monthlyScore: -1 },
    accuracy: { monthlyAccuracy: -1 },
    tests: { monthlyTests: -1 },
  }[filters.sortBy] || { monthlyRank: 1 };

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find()
      .populate('userId', 'name avatarUrl email examTarget')
      .sort(sortField)
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getHighestScores(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find()
      .populate('userId', 'name avatarUrl email examTarget')
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(),
  ]);

  return {
    leaderboard: leaderboard.map((entry, idx) => ({
      ...entry.toObject(),
      scoreRank: skip + idx + 1,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getStreakLeaderboard(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const streakField = filters.type === 'current' ? 'currentStreak' : 'longestStreak';
  const sortOption = { [streakField]: -1 };

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find()
      .populate('userId', 'name avatarUrl email examTarget')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAccuracyLeaderboard(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;
  const minAttempts = filters.minAttempts || 5;

  const [leaderboard, total] = await Promise.all([
    LeaderboardStats.find({ totalAttempts: { $gte: minAttempts } })
      .populate('userId', 'name avatarUrl email examTarget')
      .sort({ accuracy: -1 })
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments({ totalAttempts: { $gte: minAttempts } }),
  ]);

  return {
    leaderboard,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTopPerformers(filters) {
  const limit = filters.limit || 10;
  let query = {};

  if (filters.period === 'week') {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    query = { weekStartDate: { $gte: weekStart } };
  } else if (filters.period === 'month') {
    const monthStart = new Date();
    monthStart.setDate(1);
    query = { monthStartDate: { $gte: monthStart } };
  }

  const topPerformers = await LeaderboardStats.find(query)
    .populate('userId', 'name avatarUrl email examTarget')
    .sort({ totalScore: -1 })
    .limit(limit);

  return topPerformers;
}

export async function getUserRank(userId) {
  const userStats = await LeaderboardStats.findOne({ userId })
    .populate('userId', 'name avatarUrl email role examTarget');

  if (!userStats) {
    throw new ApiError(404, 'User stats not found');
  }

  // Get global rank
  const globalRank = await LeaderboardStats.countDocuments({
    totalScore: { $gt: userStats.totalScore },
  });

  // Get weekly rank
  const weeklyRank = await LeaderboardStats.countDocuments({
    weeklyScore: { $gt: userStats.weeklyScore },
  });

  // Get monthly rank
  const monthlyRank = await LeaderboardStats.countDocuments({
    monthlyScore: { $gt: userStats.monthlyScore },
  });

  return {
    ...userStats.toObject(),
    globalRank: globalRank + 1,
    weeklyRank: weeklyRank + 1,
    monthlyRank: monthlyRank + 1,
  };
}

export async function getUserStats(userId) {
  const stats = await LeaderboardStats.findOne({ userId })
    .populate('userId', 'name avatarUrl email role examTarget bio phone');

  if (!stats) {
    // Create new stats if doesn't exist
    const newStats = await LeaderboardStats.create({ userId });
    return newStats.populate('userId', 'name avatarUrl email role examTarget bio phone');
  }

  return stats;
}

export async function updateUserStats(userId, updateData) {
  let stats = await LeaderboardStats.findOne({ userId });

  if (!stats) {
    stats = await LeaderboardStats.create({ userId });
  }

  if (updateData.testScore !== undefined) {
    stats.totalScore += updateData.testScore;
    stats.weeklyScore += updateData.testScore;
    stats.monthlyScore += updateData.testScore;
    stats.totalTests += 1;
    stats.weeklyTests += 1;
    stats.monthlyTests += 1;
  }

  if (updateData.accuracy !== undefined) {
    stats.accuracy = updateData.accuracy;
    stats.weeklyAccuracy = updateData.accuracy;
    stats.monthlyAccuracy = updateData.accuracy;
  }

  if (updateData.testPassed) {
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  } else if (updateData.testPassed === false) {
    stats.currentStreak = 0;
  }

  stats.lastActivityDate = new Date();

  if (updateData.xpGained) {
    stats.totalXP += updateData.xpGained;
  }

  await stats.save();
  return stats.populate('userId', 'name avatarUrl email examTarget');
}

export async function recalculateLeaderboard() {
  const allStats = await LeaderboardStats.find();

  // Sort by total score and assign global ranks
  const sortedByScore = allStats.sort(
    (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
  );
  for (let i = 0; i < sortedByScore.length; i++) {
    sortedByScore[i].overallRank = i + 1;
    await sortedByScore[i].save();
  }

  // Sort by weekly score and assign weekly ranks
  const sortedByWeekly = allStats.sort(
    (a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0)
  );
  for (let i = 0; i < sortedByWeekly.length; i++) {
    sortedByWeekly[i].weeklyRank = i + 1;
    await sortedByWeekly[i].save();
  }

  // Sort by monthly score and assign monthly ranks
  const sortedByMonthly = allStats.sort(
    (a, b) => (b.monthlyScore || 0) - (a.monthlyScore || 0)
  );
  for (let i = 0; i < sortedByMonthly.length; i++) {
    sortedByMonthly[i].monthlyRank = i + 1;
    await sortedByMonthly[i].save();
  }

  return { message: 'Leaderboard recalculated successfully' };
}

export async function resetWeeklyScores() {
  await LeaderboardStats.updateMany(
    {},
    {
      weeklyScore: 0,
      weeklyTests: 0,
      weeklyAccuracy: 0,
      weekStartDate: new Date(),
    }
  );

  return { message: 'Weekly scores reset successfully' };
}

export async function resetMonthlyScores() {
  await LeaderboardStats.updateMany(
    {},
    {
      monthlyScore: 0,
      monthlyTests: 0,
      monthlyAccuracy: 0,
      monthStartDate: new Date(),
    }
  );

  return { message: 'Monthly scores reset successfully' };
}

export async function searchLeaderboard(query, filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const searchQuery = {
    $text: { $search: query },
  };

  const [results, total] = await Promise.all([
    LeaderboardStats.find(searchQuery)
      .populate('userId', 'name avatarUrl email examTarget')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit),
    LeaderboardStats.countDocuments(searchQuery),
  ]);

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNearbyRanks(userId, range = 5) {
  const userStats = await LeaderboardStats.findOne({ userId });

  if (!userStats) {
    throw new ApiError(404, 'User not found in leaderboard');
  }

  const userRank = userStats.overallRank || 1;
  const startRank = Math.max(1, userRank - range);
  const endRank = userRank + range;

  const nearbyRankers = await LeaderboardStats.find({})
    .populate('userId', 'name avatarUrl email examTarget')
    .sort({ overallRank: 1 })
    .skip(startRank - 1)
    .limit(endRank - startRank + 1);

  return {
    userRank,
    nearbyRankers,
  };
}

export async function processMockTestGamification(userId, attempt) {
  let stats = await LeaderboardStats.findOne({ userId });
  if (!stats) {
    stats = await LeaderboardStats.create({ userId });
  }

  // 1. Calculate XP Gained
  const isFullLength = attempt.testType === 'fullLength';
  const baseXP = isFullLength ? 120 : 60;
  const correctBonus = (attempt.correctAnswers || 0) * 10;
  
  // Speed bonus: completed in under 50% of the duration and accuracy >= 80%
  let speedBonus = 0;
  if (
    attempt.timeTakenSeconds > 0 &&
    attempt.timeTakenSeconds < (attempt.durationSeconds / 2) &&
    attempt.accuracy >= 80
  ) {
    speedBonus = 30;
  }

  // Perfect score bonus
  let perfectBonus = 0;
  if (attempt.correctAnswers === attempt.totalQuestions && attempt.totalQuestions > 0) {
    perfectBonus = 50;
  }

  const xpGained = baseXP + correctBonus + speedBonus + perfectBonus;

  // 2. Fetch all submitted/autoSubmitted attempts to recalculate stats
  const allAttempts = await MockTestAttempt.find({
    user: userId,
    status: { $in: ['submitted', 'autoSubmitted'] }
  });

  const totalTestsCount = allAttempts.length;
  const totalCorrectAnswers = allAttempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
  const totalScoreCount = allAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalAttemptsCount = allAttempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);
  
  const avgAccuracy = totalTestsCount > 0 
    ? Math.round(allAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalTestsCount)
    : 0;

  // 3. Daily Streaks Calculations
  const now = new Date();
  let currentStreak = stats.currentStreak || 0;
  let longestStreak = stats.longestStreak || 0;

  if (!stats.lastActivityDate) {
    currentStreak = 1;
  } else {
    const lastActivity = new Date(stats.lastActivityDate);
    
    // Calculate calendar days difference (ignoring time component)
    const d1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = Date.UTC(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
    const diffDays = Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Completed yesterday, increment streak
      currentStreak += 1;
    } else if (diffDays > 1) {
      // Completed older than yesterday, reset streak to 1
      currentStreak = 1;
    }
    // If diffDays === 0 (already completed today), keep streak unchanged
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // 4. Update Stats Fields
  stats.totalXP += xpGained;
  stats.totalTests = totalTestsCount;
  stats.totalAttempts = totalAttemptsCount;
  stats.correctAnswers = totalCorrectAnswers;
  stats.totalScore = totalScoreCount;
  stats.accuracy = avgAccuracy;
  stats.averageScore = totalTestsCount > 0 ? (totalScoreCount / totalTestsCount) : 0;
  stats.currentStreak = currentStreak;
  stats.longestStreak = longestStreak;
  stats.lastActivityDate = now;

  // 5. Evaluate Badges Unlocking (First Quiz, 10 Quizzes, 100 Questions Solved, Top Scorer)
  const existingBadgeNames = new Set(stats.badges.map(b => b.name));
  const newBadges = [];

  // Badge: First Quiz
  if (totalTestsCount >= 1 && !existingBadgeNames.has('First Quiz')) {
    const b = { name: 'First Quiz', earnedAt: now };
    stats.badges.push(b);
    newBadges.push(b.name);
  }

  // Badge: 10 Quizzes
  if (totalTestsCount >= 10 && !existingBadgeNames.has('10 Quizzes')) {
    const b = { name: '10 Quizzes', earnedAt: now };
    stats.badges.push(b);
    newBadges.push(b.name);
  }

  // Badge: 100 Questions Solved
  if (totalCorrectAnswers >= 100 && !existingBadgeNames.has('100 Questions Solved')) {
    const b = { name: '100 Questions Solved', earnedAt: now };
    stats.badges.push(b);
    newBadges.push(b.name);
  }

  // Badge: Top Scorer (accuracy >= 90% on a full length mock test)
  const hasTopScore = allAttempts.some(a => a.testType === 'fullLength' && a.accuracy >= 90);
  if (hasTopScore && !existingBadgeNames.has('Top Scorer')) {
    const b = { name: 'Top Scorer', earnedAt: now };
    stats.badges.push(b);
    newBadges.push(b.name);
  }

  await stats.save();

  return {
    xpGained,
    totalXP: stats.totalXP,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    newBadges,
    allBadges: stats.badges
  };
}

