# Leaderboard Module

A comprehensive leaderboard system for tracking user performance and rankings in the railway exam preparation platform.

## Features

### 1. Global Ranking
- Overall ranking based on total score
- Infinite leaderboard showing all users
- Sort by rank, score, accuracy, or tests

### 2. Weekly Ranking
- Weekly ranked leaderboard
- Resets every Monday
- Tracks weekly performance metrics

### 3. Monthly Ranking
- Monthly ranked leaderboard
- Resets on the first day of each month
- Comprehensive monthly statistics

### 4. Highest Scores
- Ranked by maximum score achieved
- Display user's highest performance
- Track improvement over time

### 5. Additional Leaderboards
- **Streak Leaders** - Track current and longest streaks
- **Accuracy Kings** - Users with highest accuracy (minimum attempts required)
- **Top Performers** - Weekly/monthly top achievers

## Database Model

### LeaderboardStats
```
- userId: Reference to User (required)
- overallRank: Number
- weeklyRank: Number
- monthlyRank: Number

Overall Stats:
- totalTests: Number
- totalQuizzes: Number
- totalScore: Number
- averageScore: Number
- correctAnswers: Number
- totalAttempts: Number
- accuracy: Number (percentage)

Weekly Stats:
- weeklyScore: Number
- weeklyTests: Number
- weeklyAccuracy: Number
- weekStartDate: Date

Monthly Stats:
- monthlyScore: Number
- monthlyTests: Number
- monthlyAccuracy: Number
- monthStartDate: Date

Streak Tracking:
- currentStreak: Number (days)
- longestStreak: Number (days)
- lastActivityDate: Date

Achievements:
- totalXP: Number
- badges: Array of {name, earnedAt}

Timestamps: createdAt, updatedAt
```

### Indexes
- `{ overallRank: 1 }`
- `{ weeklyRank: 1, weekStartDate: -1 }`
- `{ monthlyRank: 1, monthStartDate: -1 }`
- `{ totalScore: -1 }`
- `{ weeklyScore: -1 }`
- `{ monthlyScore: -1 }`
- `{ accuracy: -1 }`
- `{ currentStreak: -1 }`

## API Endpoints

### Public Routes

#### Get Global Leaderboard
```
GET /api/leaderboard/global
Query params:
  - page: number (default: 1)
  - limit: number (1-100, default: 20)
  - sortBy: 'rank' | 'score' | 'accuracy' | 'tests'
```

#### Get Weekly Leaderboard
```
GET /api/leaderboard/weekly
Query params: same as global
```

#### Get Monthly Leaderboard
```
GET /api/leaderboard/monthly
Query params: same as global
```

#### Get Highest Scores
```
GET /api/leaderboard/highest-scores
Query params:
  - page: number
  - limit: number
  - period: 'all' | 'week' | 'month'
  - category: string (optional)
```

#### Get Streak Leaderboard
```
GET /api/leaderboard/streak
Query params:
  - page: number
  - limit: number
  - type: 'current' | 'longest'
```

#### Get Accuracy Leaderboard
```
GET /api/leaderboard/accuracy
Query params:
  - page: number
  - limit: number
  - minAttempts: number (default: 5)
```

#### Get Top Performers
```
GET /api/leaderboard/top-performers
Query params:
  - limit: number (1-50, default: 10)
  - period: 'week' | 'month' (optional)
```

#### Get User Rank
```
GET /api/leaderboard/user/:userId
Response: User's rank across all leaderboards + nearby users
```

#### Search Leaderboard
```
GET /api/leaderboard/search
Query params:
  - q: string (search query)
  - page: number
  - limit: number
```

### Protected Routes

#### Get User Stats
```
GET /api/leaderboard/stats
GET /api/leaderboard/stats/:userId
Response: Full user leaderboard statistics
```

#### Update User Stats
```
POST /api/leaderboard/stats/update
Body: {
  testScore?: number,
  quizScore?: number,
  accuracy?: number,
  testPassed?: boolean,
  xpGained?: number
}
```

#### Get Nearby Ranks
```
GET /api/leaderboard/nearby
Query params:
  - range: number (default: 5)
Response: Your rank + nearby competitors
```

### Admin Routes

#### Recalculate Leaderboard (Re-ranks all users)
```
POST /api/leaderboard/admin/recalculate
```

#### Reset Weekly Scores (Manually reset weekly scores)
```
POST /api/leaderboard/admin/reset-weekly
```

#### Reset Monthly Scores (Manually reset monthly scores)
```
POST /api/leaderboard/admin/reset-monthly
```

## Frontend Components

### Pages

1. **LeaderboardPage** (`/leaderboard`)
   - Display all leaderboard types
   - Switch between Global, Weekly, Monthly, etc.
   - Sort options
   - Pagination
   - Top performers showcase

2. **LeaderboardTable** (Component)
   - Dynamic table for all leaderboard types
   - Shows rank, user info, score, accuracy, tests, XP
   - Medal badges for top 3
   - User profile links

3. **UserLeaderboardStatsPage** (`/leaderboard/stats`)
   - Personal performance dashboard
   - All your stats and rankings
   - Weekly/monthly breakdowns
   - Nearby competitors
   - Streak information
   - XP and badges

### Services

**leaderboardService.js**
- `getGlobalLeaderboard(params)`
- `getWeeklyLeaderboard(params)`
- `getMonthlyLeaderboard(params)`
- `getHighestScores(params)`
- `getStreakLeaderboard(params)`
- `getAccuracyLeaderboard(params)`
- `getTopPerformers(params)`
- `getUserRank(userId)`
- `searchLeaderboard(query, params)`
- `getUserStats(userId)`
- `updateUserStats(updateData)`
- `getNearbyRanks(range)`
- `recalculateLeaderboard()` (Admin)
- `resetWeeklyScores()` (Admin)
- `resetMonthlyScores()` (Admin)

## User Experience

### View Leaderboard
1. Navigate to `/leaderboard`
2. See top 3 performers in medal display
3. Choose leaderboard type (Global, Weekly, Monthly, etc.)
4. Sort by different metrics
5. Browse through paginated results
6. Click on any user to view profile

### Check Personal Stats
1. Navigate to `/leaderboard/stats`
2. View your ranking across all categories
3. See detailed performance metrics
4. Track your streaks and achievements
5. Compare with nearby competitors

## Statistics Tracked

### Performance Metrics
- Total Score (across all tests/quizzes)
- Average Score
- Accuracy Percentage
- Correct Answers Count
- Total Attempts
- Tests Completed
- Quizzes Completed

### Time-Based Metrics
- Weekly Score & Accuracy
- Monthly Score & Accuracy
- Current Streak (consecutive days of activity)
- Longest Streak
- Last Activity Date

### Achievement Tracking
- Total XP Points
- Badges Earned
- Rank Position (Global, Weekly, Monthly)

## Auto-Recalculation Strategy

1. **Real-time Updates**: Stats update immediately on test/quiz submission
2. **Hourly Ranking**: Leaderboard ranks recalculate every hour
3. **Daily Reset**: Streaks tracked daily at midnight UTC
4. **Weekly Reset**: Every Monday 00:00 UTC
5. **Monthly Reset**: Every 1st of month at 00:00 UTC

## Performance Considerations

### Database
- Optimized indexes on frequently queried fields
- Separate weekly/monthly stats to avoid recalculating
- Denormalized rank fields for O(1) lookup

### Queries
- Pagination to limit result sets
- Select fields to reduce payload
- Use indexes for sorting operations

### Caching (Future Enhancement)
- Cache top 100 users globally
- Cache weekly/monthly top 50
- Invalidate cache on stat updates

## Gamification Elements

- **Medals**: 🥇 🥈 🥉 for top 3
- **Ranks**: Display rank position with "# prefix
- **Streaks**: Encourage daily participation
- **XP System**: Accumulate points for achievements
- **Badges**: Earn special achievements

## Sorting Options

- **By Rank**: Default ordering (best to worst)
- **By Score**: Highest scores first
- **By Accuracy**: Best accuracy (with min attempts)
- **By Tests**: Most tests completed

## Filter Capabilities

- **Category**: Filter by exam type or subject
- **Period**: Week/Month/All Time
- **Min Attempts**: Exclude users with too few attempts
- **Time Range**: Custom date ranges

## Future Enhancements

- [ ] Friend leaderboards
- [ ] Custom time period leaderboards
- [ ] Subject-specific leaderboards
- [ ] School/coaching class leaderboards
- [ ] Regional rankings
- [ ] Difficulty-based rankings
- [ ] Multiplayer competitions
- [ ] Seasonal leaderboards
- [ ] Export leaderboard data
- [ ] Mobile app integration
- [ ] Push notifications for rank changes
- [ ] Achievement unlocks animation

## Security & Authorization

- **Public Access**: View all leaderboards (except admin endpoints)
- **Protected Access**: Personal stats and updates
- **Admin Access**: Recalculation and reset operations
- **Rate Limiting**: Prevent stat farming
- **Validation**: Prevent invalid score submissions

## Error Handling

- Graceful handling of missing user data
- Fallback for unavailable stats
- User-friendly error messages
- Logging for debugging

## Responsive Design

- Mobile-optimized leaderboard table
- Horizontal scroll for large screens
- Touch-friendly buttons
- Optimized for all device sizes

## File Structure

```
server/src/modules/leaderboard/
├── leaderboardStats.model.js
├── leaderboard.service.js
├── leaderboard.controller.js
├── leaderboard.routes.js
├── leaderboard.validation.js
└── README.md

client/src/
├── features/leaderboard/
│   └── leaderboardService.js
└── pages/
    ├── LeaderboardPage.jsx
    ├── LeaderboardTable.jsx
    └── UserLeaderboardStatsPage.jsx
```

## Integration Points

1. **Quiz Module**: Update stats on quiz completion
2. **Mock Test Module**: Update stats on test submission
3. **Current Affairs**: Track participation in quizzes
4. **User Profile**: Display rank badge
5. **Dashboard**: Show quick stats widget

## Testing Recommendations

- Test with large datasets (10k+ users)
- Verify index performance
- Test pagination at scale
- Verify weekly/monthly reset logic
- Test concurrent stat updates
- Verify ranking accuracy

## Monitoring & Metrics

- Track leaderboard query times
- Monitor update frequency
- Alert on stale rankings
- Track user engagement metrics
- Monitor badge distribution
