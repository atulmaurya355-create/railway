# Current Affairs Module

This module provides a comprehensive current affairs management system for the railway exam preparation platform.

## Features

### 1. Daily Current Affairs
- Latest daily current affairs updates
- Organized by categories (governance, economy, defence, etc.)
- Search and filter functionality
- View statistics (views, importance level)

### 2. Weekly Current Affairs
- Weekly summaries of current affairs
- Consolidated information
- Trend analysis

### 3. Monthly Current Affairs
- Monthly comprehensive reviews
- Important events summary
- Key takeaways

### 4. Current Affairs Quiz
- Daily, weekly, and monthly quizzes
- MCQ, multi-select, and true/false questions
- Timed assessments
- Score tracking and performance analysis

## Database Models

### CurrentAffairs Model
```
- title: String (required)
- description: String (required)
- content: String (rich text content)
- category: enum ['governance', 'economy', 'defence', 'sports', 'sciencetech', 'international', 'national', 'other']
- affairsType: enum ['daily', 'weekly', 'monthly']
- date: Date (required)
- keyPoints: Array of strings
- relatedTopics: Array of strings
- imageUrl: String
- importance: enum ['high', 'medium', 'low']
- source: String
- createdBy: Reference to User
- isPublished: Boolean
- views: Number (auto-incremented)
- timestamps: createdAt, updatedAt
```

### CurrentAffairsQuiz Model
```
- title: String (required)
- description: String
- quizType: enum ['daily', 'weekly', 'monthly']
- relatedAffairs: Array of CurrentAffairs references
- questions: Array of question objects
  - questionText: String
  - questionType: enum ['mcq', 'multiselect', 'truefalse']
  - options: Array of {text, isCorrect}
  - explanation: String
  - difficulty: enum ['easy', 'medium', 'hard']
  - marks: Number
- totalMarks: Number
- duration: Number (in minutes)
- passingScore: Number (percentage)
- createdBy: Reference to User
- isPublished: Boolean
- attempts: Number (auto-incremented)
- timestamps: createdAt, updatedAt
```

### CurrentAffairsQuizAttempt Model
```
- quizId: Reference to CurrentAffairsQuiz
- userId: Reference to User
- answers: Array of answer objects
  - questionIndex: Number
  - selectedOptions: Array of strings
  - isCorrect: Boolean
  - marksObtained: Number
- totalMarksObtained: Number
- totalQuestions: Number
- correctAnswers: Number
- incorrectAnswers: Number
- unattempted: Number
- percentage: Number
- isPassed: Boolean
- duration: Number (in seconds)
- startedAt: Date
- submittedAt: Date
- timestamps: createdAt, updatedAt
```

## API Endpoints

### Current Affairs Endpoints

#### Get affairs list (Public)
```
GET /api/current-affairs
Query params:
  - affairsType: 'daily' | 'weekly' | 'monthly'
  - category: string
  - page: number (default: 1)
  - limit: number (default: 20)
  - sort: 'newest' | 'oldest' | 'mostViewed'
```

#### Get single affair (Public)
```
GET /api/current-affairs/:id
```

#### Search affairs (Public)
```
GET /api/current-affairs/search
Query params:
  - q: search query
  - affairsType: optional
  - category: optional
```

#### Create affair (Admin only)
```
POST /api/current-affairs
Body: {
  title, description, content, category, affairsType,
  date, keyPoints, relatedTopics, imageUrl, importance, source
}
```

#### Update affair (Admin only)
```
PATCH /api/current-affairs/:id
Body: partial update payload
```

#### Delete affair (Admin only)
```
DELETE /api/current-affairs/:id
```

### Quiz Endpoints

#### Get quizzes list (Public)
```
GET /api/current-affairs/quiz/list
Query params:
  - quizType: 'daily' | 'weekly' | 'monthly' (optional)
  - page: number
  - limit: number
```

#### Get single quiz (Public)
```
GET /api/current-affairs/quiz/:id
```

#### Submit quiz (Authenticated)
```
POST /api/current-affairs/quiz/submit/:quizId
Body: {
  answers: [{questionIndex, selectedOptions}],
  duration: number (in seconds)
}
```

#### Get user quiz history (Authenticated)
```
GET /api/current-affairs/attempts/history
Query params:
  - quizType: optional
  - page: number
  - limit: number
```

#### Get quiz attempt details (Authenticated)
```
GET /api/current-affairs/attempts/:attemptId
```

#### Create quiz (Admin only)
```
POST /api/current-affairs/quiz
Body: {
  title, description, quizType, questions,
  totalMarks, duration, passingScore
}
```

#### Update quiz (Admin only)
```
PATCH /api/current-affairs/quiz/:id
Body: partial update payload
```

#### Delete quiz (Admin only)
```
DELETE /api/current-affairs/quiz/:id
```

## Frontend Components

### Pages

1. **CurrentAffairsPage** (`/current-affairs`)
   - List all current affairs
   - Filter by type and category
   - Search functionality
   - Pagination

2. **CurrentAffairsDetailPage** (`/current-affairs/:id`)
   - View full article
   - Display key points
   - Related topics links
   - Save and share functionality

3. **CurrentAffairsQuizPage** (`/current-affairs/quiz`)
   - Browse available quizzes
   - Filter by type
   - View quiz details
   - Recent activity sidebar

4. **CurrentAffairsQuizAttempt** (`/current-affairs/quiz/:quizId`)
   - Take active quiz
   - Timer functionality
   - Question navigation
   - Answer review before submission
   - Result display with detailed analysis

5. **CurrentAffairsAdmin** (`/admin/current-affairs`)
   - Create/edit current affairs
   - Create/edit quizzes
   - Manage content

### Services

**currentAffairsService.js**
- `getAffairsList(params)` - Fetch affairs list
- `getAffairsById(id)` - Fetch single affair
- `searchAffairs(query, params)` - Search affairs
- `createAffairs(payload)` - Create new affair
- `updateAffairs(id, payload)` - Update affair
- `deleteAffairs(id)` - Delete affair
- `getQuizList(params)` - Fetch quizzes
- `getQuizById(id)` - Fetch single quiz
- `submitQuiz(quizId, answers, duration)` - Submit quiz
- `getQuizHistory(params)` - Get user attempts
- `getQuizAttempt(attemptId)` - Get attempt details
- `createQuiz(payload)` - Create quiz
- `updateQuiz(id, payload)` - Update quiz
- `deleteQuiz(id)` - Delete quiz

## Usage Examples

### For Users

1. **View Current Affairs**
   ```
   Navigate to /current-affairs
   Select desired type (Daily/Weekly/Monthly)
   Filter by category if needed
   Click on any article to view full content
   ```

2. **Take a Quiz**
   ```
   Navigate to /current-affairs/quiz
   Select quiz type
   Click "Start Quiz"
   Answer questions within time limit
   Submit and view results
   ```

### For Administrators

1. **Create Current Affairs**
   ```
   Navigate to /admin/current-affairs
   Click "Create New Current Affairs"
   Fill in title, content, category, etc.
   Add key points and related topics
   Set importance level and click Save
   ```

2. **Create Quiz**
   ```
   Navigate to /admin/current-affairs
   Switch to "Quizzes" tab
   Create new quiz with questions
   Set total marks, duration, and passing score
   Publish when ready
   ```

## Features Highlights

- **Real-time Updates**: Add current affairs content instantly
- **Categorized Content**: Organize by governance, economy, defence, etc.
- **Intelligent Search**: Full-text search across titles, descriptions, and content
- **Interactive Quizzes**: Timed assessments with instant results
- **Performance Tracking**: Track user quiz attempts and scores
- **Mobile Responsive**: Works seamlessly on all devices
- **Dark Mode Support**: Full dark mode support for better UX

## Authentication & Authorization

- **Public Access**: View current affairs and quizzes (no login required)
- **Protected Access**: Take quizzes (authentication required)
- **Admin Access**: Create/edit/delete content (admin role required)

## File Structure

```
server/src/modules/currentAffairs/
├── currentAffairs.model.js
├── currentAffairsQuiz.model.js
├── currentAffairsQuizAttempt.model.js
├── currentAffairs.service.js
├── currentAffairs.controller.js
├── currentAffairs.routes.js
└── currentAffairs.validation.js

client/src/
├── features/currentAffairs/
│   └── currentAffairsService.js
└── pages/
    ├── CurrentAffairsPage.jsx
    ├── CurrentAffairsDetailPage.jsx
    ├── CurrentAffairsQuizPage.jsx
    ├── CurrentAffairsQuizAttempt.jsx
    └── CurrentAffairsAdmin.jsx
```

## Future Enhancements

- [ ] PDF export for articles
- [ ] Email notifications for new affairs
- [ ] Advanced analytics dashboard
- [ ] Personalized quiz recommendations
- [ ] Interactive discussion forums
- [ ] Related videos integration
- [ ] Voice-to-text summary generation
- [ ] Bookmarking and notes feature
- [ ] Collaborative learning groups
