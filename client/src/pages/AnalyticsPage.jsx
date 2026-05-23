import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Flame,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Activity,
  Info,
  RefreshCw,
  Home,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { NotificationDropdown } from '../components/NotificationDropdown.jsx';
import { httpClient } from '../services/httpClient.js';

// Chart.js imports and configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const navigationItems = [
  { label: 'Home Page', icon: Home, href: '/' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mock Tests', icon: ClipboardList, href: '/mock-tests' },
  { label: 'Study Materials', icon: BookOpenCheck, href: '/study-materials' },
  { label: 'Previous Papers', icon: FileText, href: '/previous-papers' },
  { label: 'AI Tutor', icon: Sparkles, href: '/ai-tutor' },
  { label: 'Analytics', icon: BarChart3, active: true, href: '/analytics' },
  { label: 'Study Plan', icon: CalendarDays, href: '/study-plan' },
  { label: 'Achievements', icon: Trophy, href: '/achievements' },
  { label: 'Settings', icon: Settings, href: '/profile' },
];

// Rich high-fidelity synthetic demo data
const demoAttempts = [
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 01',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 72,
    totalQuestions: 100,
    accuracy: 78,
    correctAnswers: 72,
    wrongAnswers: 20,
    skippedAnswers: 8,
    durationSeconds: 5400,
    timeTakenSeconds: 5100,
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    topicPerformance: {
      Mathematics: { correct: 24, total: 30 },
      Reasoning: { correct: 26, total: 30 },
      'General Awareness': { correct: 22, total: 40 },
    }
  },
  {
    title: 'Arithmetic Speed & Sectional Mock Test',
    testType: 'sectional',
    category: 'General Railway',
    topic: 'Mathematics',
    score: 18,
    totalQuestions: 25,
    accuracy: 82,
    correctAnswers: 18,
    wrongAnswers: 4,
    skippedAnswers: 3,
    durationSeconds: 1500,
    timeTakenSeconds: 1100,
    submittedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 18, total: 25 },
    }
  },
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 02',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 79,
    totalQuestions: 100,
    accuracy: 84,
    correctAnswers: 79,
    wrongAnswers: 15,
    skippedAnswers: 6,
    durationSeconds: 5400,
    timeTakenSeconds: 4900,
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 26, total: 30 },
      Reasoning: { correct: 27, total: 30 },
      'General Awareness': { correct: 26, total: 40 },
    }
  },
  {
    title: 'Reasoning Sectional Speed Quiz',
    testType: 'sectional',
    category: 'Group D',
    topic: 'Reasoning',
    score: 22,
    totalQuestions: 25,
    accuracy: 92,
    correctAnswers: 22,
    wrongAnswers: 2,
    skippedAnswers: 1,
    durationSeconds: 1500,
    timeTakenSeconds: 950,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Reasoning: { correct: 22, total: 25 },
    }
  },
  {
    title: 'General Science Focus Drill',
    testType: 'sectional',
    category: 'ALP & Technician',
    topic: 'General Science',
    score: 15,
    totalQuestions: 20,
    accuracy: 75,
    correctAnswers: 15,
    wrongAnswers: 5,
    skippedAnswers: 0,
    durationSeconds: 1200,
    timeTakenSeconds: 700,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      'General Science': { correct: 15, total: 20 },
    }
  },
  {
    title: 'RRB NTPC CBT-1 Full Mock Test 03',
    testType: 'fullLength',
    category: 'RRB NTPC',
    topic: 'All Topics',
    score: 84,
    totalQuestions: 100,
    accuracy: 88,
    correctAnswers: 84,
    wrongAnswers: 11,
    skippedAnswers: 5,
    durationSeconds: 5400,
    timeTakenSeconds: 4800,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    topicPerformance: {
      Mathematics: { correct: 28, total: 30 },
      Reasoning: { correct: 28, total: 30 },
      'General Awareness': { correct: 28, total: 40 },
    }
  }
];

export function AnalyticsPage() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [useDemoData, setUseDemoData] = useState(true);
  const [liveAttempts, setLiveAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, fullLength, sectional

  // Fetch live attempts on mount
  useEffect(() => {
    async function fetchAttempts() {
      try {
        setIsLoading(true);
        const response = await httpClient.get('/mock-tests/history/attempts');
        const attempts = response.data?.data?.attempts ?? [];
        setLiveAttempts(attempts);
        if (attempts.length > 0) {
          // If the user has completed attempts, default to live mode!
          setUseDemoData(false);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch test history:', err);
        setError('Could not retrieve mock test history. Displaying demo data instead.');
        setUseDemoData(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttempts();
  }, []);

  // Determine active attempts based on user choice and filter type
  const activeAttempts = useMemo(() => {
    const rawAttempts = useDemoData ? demoAttempts : liveAttempts;
    let filtered = [...rawAttempts];

    // Sort chronologically ascending for trend line calculations
    filtered.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.testType === filterType);
    }
    return filtered;
  }, [useDemoData, liveAttempts, filterType]);

  // Calculate statistics
  const metrics = useMemo(() => {
    if (activeAttempts.length === 0) {
      return {
        accuracy: 0,
        totalTests: 0,
        timeSpent: '0h 0m',
        progress: 0,
        weakTopics: [],
        strongTopics: []
      };
    }

    // 1. Total Tests
    const totalTests = activeAttempts.length;

    // 2. Average Accuracy & Progress
    const totalAccuracySum = activeAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0);
    const averageAccuracy = Math.round(totalAccuracySum / totalTests);

    // 3. Time Spent
    const totalSeconds = activeAttempts.reduce((sum, a) => sum + (a.timeTakenSeconds || 0), 0);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const timeSpentString = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    // 4. Progress (overall improvement delta)
    let progressImprovement = 0;
    if (totalTests > 1) {
      const firstAcc = activeAttempts[0].accuracy || 0;
      const lastAcc = activeAttempts[totalTests - 1].accuracy || 0;
      progressImprovement = lastAcc - firstAcc;
    } else if (totalTests === 1) {
      progressImprovement = activeAttempts[0].accuracy || 0;
    }

    // 5. Subject Topic breakdown (Mathematics, Reasoning, General Awareness, General Science, Current Affairs)
    // We parse topic statistics
    const defaultTopics = {
      Mathematics: { correct: 0, total: 0 },
      Reasoning: { correct: 0, total: 0 },
      'General Science': { correct: 0, total: 0 },
      'General Awareness': { correct: 0, total: 0 },
      'Current Affairs': { correct: 0, total: 0 }
    };

    // Aggregate topic performance
    activeAttempts.forEach(attempt => {
      // If the attempt has topicPerformance details (like our high-fidelity seed demo attempts)
      if (attempt.topicPerformance) {
        Object.entries(attempt.topicPerformance).forEach(([topic, stats]) => {
          if (defaultTopics[topic]) {
            defaultTopics[topic].correct += stats.correct;
            defaultTopics[topic].total += stats.total;
          }
        });
      } else {
        // Fallback for live attempts where we analyze individual questions if available
        if (attempt.questions && attempt.questions.length > 0) {
          attempt.questions.forEach(q => {
            const topicGroup = getTopicGroup(q.topic);
            if (defaultTopics[topicGroup]) {
              defaultTopics[topicGroup].total += 1;
              if (q.isCorrect) {
                defaultTopics[topicGroup].correct += 1;
              }
            }
          });
        } else if (attempt.topic) {
          // Attempt-level topic for sectional mocks
          const topicGroup = getTopicGroup(attempt.topic);
          if (defaultTopics[topicGroup]) {
            defaultTopics[topicGroup].total += attempt.totalQuestions;
            defaultTopics[topicGroup].correct += attempt.correctAnswers;
          }
        } else {
          // Distributed fallback for full mocks
          defaultTopics['Mathematics'].total += Math.round(attempt.totalQuestions * 0.3);
          defaultTopics['Mathematics'].correct += Math.round(attempt.correctAnswers * 0.3);
          defaultTopics['Reasoning'].total += Math.round(attempt.totalQuestions * 0.3);
          defaultTopics['Reasoning'].correct += Math.round(attempt.correctAnswers * 0.3);
          defaultTopics['General Awareness'].total += Math.round(attempt.totalQuestions * 0.4);
          defaultTopics['General Awareness'].correct += Math.round(attempt.correctAnswers * 0.4);
        }
      }
    });

    const parsedTopics = Object.entries(defaultTopics)
      .map(([name, stats]) => {
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        return { name, accuracy, total: stats.total };
      })
      .filter(t => t.total > 0);

    const strongTopics = parsedTopics.filter(t => t.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy);
    const weakTopics = parsedTopics.filter(t => t.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy);

    // If empty strong/weak, provide fallback
    const fallbackStrong = strongTopics.length > 0 ? strongTopics : [{ name: 'Reasoning', accuracy: 84 }];
    const fallbackWeak = weakTopics.length > 0 ? weakTopics : [{ name: 'Current Affairs', accuracy: 62 }];

    return {
      accuracy: averageAccuracy,
      totalTests,
      timeSpent: timeSpentString,
      progress: progressImprovement,
      weakTopics: weakTopics.length > 0 ? weakTopics : fallbackWeak,
      strongTopics: strongTopics.length > 0 ? strongTopics : fallbackStrong,
      topicMetrics: parsedTopics
    };
  }, [activeAttempts]);

  // Chart configuration Helper Functions
  const chartData = useMemo(() => {
    if (activeAttempts.length === 0) return null;

    // 1. Line Chart Data: Accuracy Trend
    const lineLabels = activeAttempts.map((attempt, index) => `Mock #${index + 1}`);
    const lineScores = activeAttempts.map(attempt => attempt.accuracy);

    const lineData = {
      labels: lineLabels,
      datasets: [
        {
          label: 'Accuracy (%)',
          data: lineScores,
          borderColor: '#005BAC', // Railway Blue
          backgroundColor: 'rgba(0, 91, 172, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#FFC107', // Railway Gold
          pointHoverRadius: 7,
          pointRadius: 4
        }
      ]
    };

    // 2. Pie Chart Data: Overall Answers Distribution
    const correctSum = activeAttempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
    const wrongSum = activeAttempts.reduce((sum, a) => sum + (a.wrongAnswers || 0), 0);
    const skippedSum = activeAttempts.reduce((sum, a) => sum + (a.skippedAnswers || 0), 0);

    const pieData = {
      labels: ['Correct', 'Wrong', 'Skipped'],
      datasets: [
        {
          data: [correctSum, wrongSum, skippedSum],
          backgroundColor: [
            'rgba(0, 91, 172, 0.8)', // Railway Blue
            'rgba(211, 47, 47, 0.8)',  // Railway Red
            'rgba(255, 193, 7, 0.8)'   // Railway Gold
          ],
          borderColor: [
            '#005BAC',
            '#D32F2F',
            '#FFC107'
          ],
          borderWidth: 1.5,
          hoverOffset: 4
        }
      ]
    };

    // 3. Bar Chart Data: Topic Wise Performance
    const barLabels = metrics.topicMetrics ? metrics.topicMetrics.map(t => t.name) : ['Mathematics', 'Reasoning', 'Science', 'Awareness'];
    const barDataPoints = metrics.topicMetrics ? metrics.topicMetrics.map(t => t.accuracy) : [80, 85, 75, 65];

    const barData = {
      labels: barLabels,
      datasets: [
        {
          label: 'Accuracy Score (%)',
          data: barDataPoints,
          backgroundColor: 'rgba(0, 91, 172, 0.75)', // Railway Blue
          borderColor: '#005BAC',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    };

    return { lineData, pieData, barData };
  }, [activeAttempts, metrics]);

  const initials = getInitials(user?.name);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid min-h-[calc(100vh-9rem)] lg:grid-cols-[17rem_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 lg:block">
            <SidebarContent />
          </aside>

          {isSidebarOpen ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 bg-slate-950/50"
                onClick={() => setIsSidebarOpen(false)}
              />
              <aside className="relative h-full w-72 border-r border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-bold text-slate-950 dark:text-white">Navigation</p>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <SidebarContent />
              </aside>
            </div>
          ) : null}

          {/* Main Dashboard Screen */}
          <div className="min-w-0 bg-slate-50 dark:bg-slate-950">
            {/* Nav Header */}
            <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label="Open navigation"
                    className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu size={19} aria-hidden="true" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Preparation Analytics</p>
                    <h1 className="truncate text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                      Performance Insights
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NotificationDropdown />
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-left dark:border-slate-800 dark:bg-slate-950"
                      aria-expanded={isProfileOpen}
                      onClick={() => setIsProfileOpen((current) => !current)}
                    >
                      <span className="grid size-8 place-items-center rounded-md bg-brand-600 text-sm font-bold text-white">
                        {initials}
                      </span>
                      <span className="hidden max-w-32 truncate text-sm font-medium text-slate-800 dark:text-slate-100 sm:block">
                        {user?.name ?? 'Student'}
                      </span>
                      <ChevronDown size={16} className="text-slate-500" aria-hidden="true" />
                    </button>

                    {isProfileOpen ? (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                            {user?.name ?? 'Student'}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <User size={16} aria-hidden="true" />
                          Profile
                        </Link>
                        <Link
                          to="/profile"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Settings size={16} aria-hidden="true" />
                          Account settings
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
                          onClick={logout}
                        >
                          <LogOut size={16} aria-hidden="true" />
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </nav>

            {/* Dashboard Contents */}
            <div className="space-y-6 p-4 sm:p-6">
              {/* Dynamic / Seed Data Toggle Banner */}
              <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      useDemoData
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      <Info size={13} />
                      {useDemoData ? 'Demo Data Mode' : 'Live Data Mode'}
                    </span>
                    {error && (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        (Api offline/empty)
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    {useDemoData
                      ? 'Displaying curated RRB NTPC prep metrics'
                      : 'Displaying your live mock test performance statistics'}
                  </h2>
                  <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400">
                    Toggle mode to view your actual attempts history or check the high-fidelity preparation visualizations immediately.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setUseDemoData(!useDemoData)}
                    className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                  >
                    <RefreshCw size={14} />
                    Switch to {useDemoData ? 'Live Data' : 'Demo Data'}
                  </button>
                </div>
              </div>

              {/* Filters & Control Row */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All Mocks' },
                    { id: 'fullLength', label: 'Full Length' },
                    { id: 'sectional', label: 'Sectional' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilterType(btn.id)}
                      className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                        filterType === btn.id
                          ? 'bg-cyan-600 text-white dark:bg-cyan-500'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total analyzed: {activeAttempts.length} mock tests
                </span>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Accuracy */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Overall Accuracy</p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
                        {metrics.accuracy}%
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-emerald-500 bg-emerald-500/10 shadow-inner shrink-0">
                      <Target size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span>Average correctness index</span>
                  </p>
                </article>

                {/* Total Tests */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Mock Tests</p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
                        {metrics.totalTests}
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-cyan-500 bg-cyan-500/10 shadow-inner shrink-0">
                      <ClipboardList size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Activity size={14} className="text-cyan-500" />
                    <span>Completed practice drills</span>
                  </p>
                </article>

                {/* Time Spent */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Time Spent</p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
                        {metrics.timeSpent}
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-violet-500 bg-violet-500/10 shadow-inner shrink-0">
                      <Clock size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Zap size={14} className="text-violet-500" />
                    <span>Active exam duration logged</span>
                  </p>
                </article>

                {/* Progress Card */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress Tracker</p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">
                        {metrics.progress >= 0 ? `+${metrics.progress}%` : `${metrics.progress}%`}
                      </p>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-amber-500 bg-amber-500/10 shadow-inner shrink-0">
                      <Gauge size={20} />
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Performance improvement trend delta</span>
                  </p>
                </article>

                {/* Strong Topics */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Strong Topics (Acc ≥ 70%)</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {metrics.strongTopics.slice(0, 2).map(t => (
                          <span key={t.name} className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {t.name} ({t.accuracy}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-emerald-500 bg-emerald-500/10 shadow-inner shrink-0">
                      <ShieldCheck size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Solid foundational domains
                  </p>
                </article>

                {/* Weak Topics */}
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Weak Topics (Acc &lt; 70%)</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {metrics.weakTopics.slice(0, 2).map(t => (
                          <span key={t.name} className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-800 dark:bg-red-950/40 dark:text-red-300">
                            {t.name} ({t.accuracy}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="grid size-11 place-items-center rounded-lg text-red-500 bg-red-500/10 shadow-inner shrink-0">
                      <AlertCircle size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Recommended for practice
                  </p>
                </article>
              </div>

              {/* Charts Display Grid */}
              {chartData ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Line Chart */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-950 dark:text-white">Accuracy Improvement Trend</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy evolution over consecutive mock attempts</p>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <Line
                          data={chartData.lineData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                callbacks: {
                                  label: (context) => `Accuracy: ${context.parsed.y}%`
                                }
                              }
                            },
                            scales: {
                              y: {
                                min: 0,
                                max: 100,
                                ticks: { stepSize: 20 },
                                grid: {
                                  color: 'rgba(148, 163, 184, 0.1)'
                                }
                              },
                              x: {
                                grid: { display: false }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-950 dark:text-white">Subject-wise Correctness Index</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Preparation strength across different exam topics</p>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <Bar
                          data={chartData.barData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false }
                            },
                            scales: {
                              y: {
                                min: 0,
                                max: 100,
                                grid: {
                                  color: 'rgba(148, 163, 184, 0.1)'
                                }
                              },
                              x: {
                                grid: { display: false }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
                    {/* Pie Chart */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div>
                        <h3 className="text-base font-bold text-slate-950 dark:text-white">Answer Distribution</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total ratio of correct, skipped, and wrong responses</p>
                      </div>
                      <div className="mt-6 h-56 flex items-center justify-center">
                        <Pie
                          data={chartData.pieData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: { boxWidth: 12, padding: 15 }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Table showing historical attempts list */}
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-950 dark:text-white">Analyzed Attempts Log</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Historical submitted records included in this chart compilation</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                              <th className="pb-2.5 font-semibold">Test Details</th>
                              <th className="pb-2.5 font-semibold">Score</th>
                              <th className="pb-2.5 font-semibold">Accuracy</th>
                              <th className="pb-2.5 font-semibold">Duration</th>
                              <th className="pb-2.5 font-semibold">Submitted Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...activeAttempts].reverse().map((attempt, index) => (
                              <tr key={attempt.title + index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 dark:border-slate-800/40 dark:hover:bg-slate-900/30">
                                <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                                  <div className="flex flex-col">
                                    <span>{attempt.title}</span>
                                    <span className="text-xs text-slate-400 font-medium capitalize">
                                      {attempt.testType === 'fullLength' ? 'Full Mock' : `Sectional Mock • ${attempt.topic || attempt.category}`}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 text-slate-700 dark:text-slate-300">
                                  {attempt.score}/{attempt.totalQuestions}
                                </td>
                                <td className="py-3 font-bold text-brand-700 dark:text-cyan-300">
                                  {attempt.accuracy}%
                                </td>
                                <td className="py-3 text-slate-600 dark:text-slate-400">
                                  {formatTime(attempt.timeTakenSeconds)}
                                </td>
                                <td className="py-3 text-slate-500 dark:text-slate-400">
                                  {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <BarChart3 className="mx-auto size-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">No attempts found</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Go ahead and complete your first mock test attempt to visualize dynamic analytics here!
                  </p>
                  <Link
                    to="/mock-tests"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                  >
                    Start A Mock Test
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        {/* Profile Branding Header */}
        <div className="rounded-xl bg-gradient-to-br from-railway-blue via-railway-blue to-railway-navy p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-bl-full" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-200">
            Exam Prep Deck
          </p>
          <p className="mt-0.5 text-base font-extrabold leading-tight">Aspirant Console</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] bg-white/15 px-2.5 py-1 rounded font-bold self-start w-fit">
            <ShieldCheck size={11} className="text-railway-gold" />
            <span>Secure account verified</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href ?? '/dashboard'}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-railway-blue/10 to-transparent text-railway-blue border-l-[3px] border-railway-blue dark:text-cyan-400 dark:from-cyan-500/10'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
              }`}
            >
              <item.icon size={15} className={item.active ? 'text-railway-blue dark:text-cyan-400' : 'text-slate-400'} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 font-semibold text-center">
          Railway Prep Engine v2.0
        </p>
      </div>
    </div>
  );
}

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds || 0, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const seconds = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Maps deep topic names to main category groups
function getTopicGroup(topicName = '') {
  const lower = topicName.toLowerCase();
  if (lower.includes('math') || lower.includes('arithmetic') || lower.includes('profit') || lower.includes('loss') || lower.includes('speed') || lower.includes('algebra')) {
    return 'Mathematics';
  }
  if (lower.includes('reasoning') || lower.includes('logic') || lower.includes('coding') || lower.includes('decoding')) {
    return 'Reasoning';
  }
  if (lower.includes('science') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology')) {
    return 'General Science';
  }
  if (lower.includes('current') || lower.includes('affair')) {
    return 'Current Affairs';
  }
  return 'General Awareness';
}
