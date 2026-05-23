# Railway Exam Preparation Platform

Production-ready project foundation for a Railway Exam Preparation Platform using React, Vite, Tailwind CSS, React Router, Node.js, Express.js, and MongoDB.

This scaffold intentionally includes only the foundation: app shell, routing, reusable UI primitives, dark mode, API bootstrap, MongoDB connection, environment validation, security middleware, and a health endpoint.

## Folder Structure

```text
railway-exam-prep-platform/
  client/
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    eslint.config.js
    .env.example
    src/
      components/
        layout/
          Header.jsx
        theme/
          ThemeToggle.jsx
        ui/
          Button.jsx
          IconButton.jsx
      config/
        appConfig.js
      features/
        README.md
        auth/
          AuthProvider.jsx
          authService.js
          authStorage.js
          components/
            AuthCard.jsx
            AuthLayout.jsx
            FormField.jsx
            ProtectedRoute.jsx
            StatusMessage.jsx
          pages/
            ForgotPasswordPage.jsx
            LoginPage.jsx
            RegisterPage.jsx
            ResetPasswordPage.jsx
            VerifyEmailPage.jsx
      layouts/
        AppLayout.jsx
      pages/
        DashboardPage.jsx
        HomePage.jsx
        NotFoundPage.jsx
      providers/
        ThemeProvider.jsx
      routes/
        router.jsx
      services/
        httpClient.js
      styles/
        index.css
      main.jsx
  server/
    package.json
    eslint.config.js
    .env.example
    src/
      app.js
      server.js
      config/
        database.js
        env.js
      middlewares/
        errorHandler.js
        notFoundHandler.js
        rateLimiter.js
        authenticate.js
        authorize.js
        validateRequest.js
      modules/
        README.md
        auth/
          auth.controller.js
          auth.cookies.js
          auth.routes.js
          auth.service.js
          auth.tokens.js
          auth.validation.js
          user.model.js
        health/
          health.controller.js
          health.routes.js
      routes/
        index.js
      shared/
        constants/
          httpStatus.js
        validators/
          objectId.validator.js
      utils/
        apiError.js
        asyncHandler.js
        email.js
        logger.js
  package.json
  .gitignore
  .prettierrc
  README.md
```

## Package Dependencies

### Root

- `concurrently`: runs frontend and backend development servers together.
- `prettier`: shared formatting.

### Frontend

- `react`, `react-dom`: UI framework.
- `vite`, `@vitejs/plugin-react`: development server and build tooling.
- `tailwindcss`, `postcss`, `autoprefixer`: utility-first styling.
- `react-router-dom`: client-side routing.
- `axios`: API HTTP client.
- `lucide-react`: icon system.
- `clsx`: conditional class composition.
- `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`: linting.

### Backend

- `express`: API framework.
- `mongoose`: MongoDB object modeling and connection layer.
- `dotenv`: local environment variable loading.
- `zod`: environment and future request validation.
- `cors`: controlled frontend access.
- `helmet`: secure HTTP headers.
- `morgan`: request logging.
- `compression`: response compression.
- `cookie-parser`: cookie parsing for future auth flows.
- `express-rate-limit`: API rate limiting.
- `jsonwebtoken`, `bcryptjs`: ready for future authentication.
- `nodemailer`: email delivery for verification and password reset links.
- `multer`: profile picture upload handling.
- `nodemon`: backend development reloads.
- `eslint`: linting.

## Installation Steps

1. Install Node.js 20 or newer.

2. Install MongoDB locally, or prepare a MongoDB Atlas connection string.

3. Install dependencies from the project root:

```bash
npm install
```

4. Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

5. Update `server/.env` with your real MongoDB URI and JWT secrets.

6. Start both apps:

```bash
npm run dev
```

7. Open the frontend:

```text
http://localhost:5173
```

8. Check backend health:

```text
http://localhost:5000/api/v1/health
```

## Environment Variables

### Frontend: `client/.env`

```env
VITE_APP_NAME="Railway Prep"
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend: `server/.env`

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/railway_exam_prep

JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_VERIFICATION_EXPIRES_MINUTES=60
PASSWORD_RESET_EXPIRES_MINUTES=15

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="Railway Prep <no-reply@railwayprep.local>"

OPENAI_API_KEY=
OPENAI_TUTOR_MODEL=gpt-5.2

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Architecture Explanation

The project uses a workspace structure with separate `client` and `server` packages. This keeps frontend and backend concerns isolated while allowing a single root command to run the full stack.

The frontend is organized around reusable UI, layout, routing, providers, and future feature modules. Shared pieces such as `Button`, `IconButton`, the app layout, and the theme provider live outside feature folders so future modules like mock tests, practice sets, syllabus tracking, authentication, and analytics can reuse them without duplication.

The backend follows a module-oriented Express architecture. `app.js` owns middleware and route registration, while `server.js` owns database connection and process startup. Versioned API routes are mounted under `/api/v1`, and feature domains should be added under `server/src/modules`.

Environment variables are validated at startup with Zod. This prevents the API from running with missing MongoDB or auth configuration. Security middleware is included from the beginning: Helmet, CORS, compression, request logging, JSON body limits, and rate limiting.

MongoDB is connected through a dedicated config layer. Future data models should stay inside their own domain modules, for example:

```text
server/src/modules/tests/test.model.js
server/src/modules/tests/test.routes.js
server/src/modules/tests/test.controller.js
server/src/modules/tests/test.service.js
```

This structure keeps controllers thin, moves business logic into services, and makes each exam-prep feature easier to test and maintain.

## Authentication System

The authentication module is implemented under `server/src/modules/auth` and `client/src/features/auth`.

### Backend Auth Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
GET  /api/v1/auth/verify-email/:token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Backend Profile Endpoints

```text
GET    /api/v1/profile
PUT    /api/v1/profile
PATCH  /api/v1/profile/password
POST   /api/v1/profile/avatar
DELETE /api/v1/profile
```

### Question Management Endpoints

```text
GET    /api/v1/questions
GET    /api/v1/questions/:id
POST   /api/v1/questions
PUT    /api/v1/questions/:id
DELETE /api/v1/questions/:id
```

Question search supports `search`, `topic`, `category`, `difficulty`, `page`, `limit`, and `includeInactive` query parameters. Create, update, and delete operations are admin-protected.

### Railway Mock Test Endpoints

```text
GET  /api/v1/mock-tests/config
POST /api/v1/mock-tests/start
GET  /api/v1/mock-tests/:attemptId
POST /api/v1/mock-tests/:attemptId/submit
GET  /api/v1/mock-tests/:attemptId/rank
GET  /api/v1/mock-tests/leaderboard
```

The mock test module supports full length tests, sectional tests, random question selection from the question bank, countdown-driven frontend auto submit, result explanations, and ranking by score, accuracy, and completion time.

### AI Tutor Endpoints

```text
GET    /api/v1/ai-tutor/sessions
GET    /api/v1/ai-tutor/sessions/:sessionId
DELETE /api/v1/ai-tutor/sessions/:sessionId
POST   /api/v1/ai-tutor/ask
```

The AI tutor uses the OpenAI Responses API through the official Node SDK. It supports doubt solving, reasoning help, answer explanations, question generation, study planning, personalized recommendations, saved chat history, and development fallback responses when `OPENAI_API_KEY` is not configured.

### Previous Year Papers Endpoints

```text
GET    /api/v1/previous-papers
POST   /api/v1/previous-papers
GET    /api/v1/previous-papers/:paperId
GET    /api/v1/previous-papers/:paperId/download
DELETE /api/v1/previous-papers/:paperId
```

The previous year papers module supports admin PDF uploads, metadata storage, app-based PDF viewing, download links, year filtering, exam filtering, and keyword search.

### Study Materials Endpoints

```text
GET    /api/v1/study-materials
POST   /api/v1/study-materials
GET    /api/v1/study-materials/:materialId
GET    /api/v1/study-materials/:materialId/download
DELETE /api/v1/study-materials/:materialId
```

The study materials module supports notes, PDFs, formula sheets, topic-wise materials, metadata search, topic/category filters, admin uploads, and tracked downloads.

### Backend Auth Features

- Passwords are hashed with bcrypt before saving users.
- Access tokens are signed JWTs returned to the client.
- Refresh tokens are stored as HTTP-only cookies and hashed in MongoDB.
- Email verification tokens and password reset tokens are stored as SHA-256 hashes.
- Protected routes use `authenticate`.
- Role-protected routes can use `authorize('admin')`.
- Request bodies are validated with Zod schemas.
- If SMTP variables are empty in development, email contents are logged to the API console.

### Frontend Auth Features

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password/:token`
- `/verify-email/:token`
- `/dashboard` protected by `ProtectedRoute`
- `/profile` protected by `ProtectedRoute`
- `/mock-tests` protected by `ProtectedRoute`
- `/ai-tutor` protected by `ProtectedRoute`
- `/previous-papers` protected by `ProtectedRoute`
- `/study-materials` protected by `ProtectedRoute`

The frontend keeps the access token in local storage and relies on the backend refresh-token cookie to restore sessions after page reloads.

### Profile Management Features

- Update name, email, phone, bio, and exam target.
- Upload profile picture with local development storage under `server/uploads`.
- Change password with current-password verification.
- Delete account with password confirmation.

## Suggested Next Features

- Subject and topic management.
- Question bank import flow.
- Mock test attempt engine.
- Practice set filtering.
- Performance analytics.
- Admin dashboard.
