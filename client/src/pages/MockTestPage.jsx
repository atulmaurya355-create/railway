import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  Medal,
  Play,
  RotateCcw,
  Send,
  Shuffle,
  TimerReset,
  Trophy,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { mockTestService } from '../features/mockTests/mockTestService.js';

const answerLetters = ['A', 'B', 'C', 'D'];

export function MockTestPage() {
  const [config, setConfig] = useState(null);
  const [setup, setSetup] = useState({
    testType: 'fullLength',
    category: '',
    topic: '',
    questionCount: 5,
    durationMinutes: 10,
  });
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const data = await mockTestService.getConfig();
      setConfig(data);
    }

    loadConfig();
  }, []);

  const currentQuestion = attempt?.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = attempt ? Math.round((answeredCount / attempt.totalQuestions) * 100) : 0;
  const timeTakenSeconds = attempt ? attempt.durationSeconds - secondsLeft : 0;
  const answeredSet = useMemo(() => new Set(Object.keys(answers)), [answers]);

  useEffect(() => {
    if (!attempt || result) {
      return undefined;
    }

    if (secondsLeft <= 0) {
      submitTest(true);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, result, secondsLeft]);

  async function startTest(event) {
    event.preventDefault();
    setIsStarting(true);
    const startedAttempt = await mockTestService.startTest(setup);
    setAttempt(startedAttempt);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setSecondsLeft(startedAttempt.durationSeconds);
    setIsStarting(false);
  }

  function selectAnswer(answer) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: answer }));
  }

  function skipQuestion() {
    setAnswers((current) => {
      const next = { ...current };
      delete next[currentQuestion.id];
      return next;
    });
    setCurrentIndex((index) => Math.min(index + 1, attempt.questions.length - 1));
  }

  async function submitTest(isAutoSubmitted = false) {
    if (!attempt || isSubmitting || result) {
      return;
    }

    setIsSubmitting(true);
    const submittedResult = await mockTestService.submitTest(attempt, {
      answers,
      timeTakenSeconds,
      isAutoSubmitted,
    });
    const leaders = await mockTestService.getLeaderboard({
      testType: submittedResult.testType,
      category: submittedResult.category,
      topic: submittedResult.topic,
    });
    setResult(submittedResult);
    setLeaderboard(leaders);
    setIsSubmitting(false);
  }

  function resetTest() {
    setAttempt(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    setSecondsLeft(0);
  }

  if (!config) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Loading mock test module...
      </div>
    );
  }

  if (result) {
    return (
      <MockTestResult
        result={result}
        leaderboard={leaderboard}
        onRetake={() => {
          setResult(null);
          setAnswers({});
          setCurrentIndex(0);
          setSecondsLeft(attempt.durationSeconds);
        }}
        onNewTest={resetTest}
      />
    );
  }

  if (!attempt) {
    return (
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
            Railway Mock Test Module
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Start a mock test</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose full length or sectional mode, generate random questions, and compete on ranked
            attempts with automatic submission when time expires.
          </p>
        </div>

        <form
          className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1fr_22rem]"
          onSubmit={startTest}
        >
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {config.testTypes.map((testType) => (
                <button
                  key={testType.id}
                  type="button"
                  className={`rounded-lg border p-5 text-left transition ${
                    setup.testType === testType.id
                      ? 'border-brand-600 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-950/40'
                      : 'border-slate-200 hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-800'
                  }`}
                  onClick={() =>
                    setSetup((current) => ({
                      ...current,
                      testType: testType.id,
                      questionCount: Math.min(testType.defaultQuestionCount, 20),
                      durationMinutes: testType.defaultDurationMinutes,
                    }))
                  }
                >
                  <span className="mb-4 grid size-10 place-items-center rounded-md bg-brand-600 text-white">
                    {testType.id === 'fullLength' ? <TimerReset size={20} /> : <BarChart3 size={20} />}
                  </span>
                  <h2 className="font-bold text-slate-950 dark:text-white">{testType.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {testType.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Category"
                value={setup.category}
                onChange={(value) => setSetup((current) => ({ ...current, category: value }))}
                options={config.categories}
                placeholder="All categories"
              />
              <SelectField
                label="Topic"
                value={setup.topic}
                onChange={(value) => setSetup((current) => ({ ...current, topic: value }))}
                options={config.topics}
                placeholder="All topics"
              />
              <NumberField
                label="Questions"
                value={setup.questionCount}
                min={1}
                max={100}
                onChange={(value) => setSetup((current) => ({ ...current, questionCount: value }))}
              />
              <NumberField
                label="Duration Minutes"
                value={setup.durationMinutes}
                min={1}
                max={180}
                onChange={(value) => setSetup((current) => ({ ...current, durationMinutes: value }))}
              />
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="font-bold text-slate-950 dark:text-white">Test summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <SummaryRow label="Mode" value={setup.testType === 'fullLength' ? 'Full Length' : 'Sectional'} />
              <SummaryRow label="Questions" value={setup.questionCount} />
              <SummaryRow label="Duration" value={`${setup.durationMinutes} min`} />
              <SummaryRow label="Selection" value={setup.topic || setup.category || 'Random'} />
            </div>
            <Button type="submit" className="mt-5 w-full gap-2" disabled={isStarting}>
              {isStarting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              Start Test
            </Button>
          </aside>
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              {attempt.testType === 'fullLength' ? 'Full Length Test' : 'Sectional Test'}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{attempt.title}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric icon={Clock3} label="Countdown" value={formatTime(secondsLeft)} />
            <Metric icon={CheckCircle2} label="Answered" value={`${answeredCount}/${attempt.totalQuestions}`} />
            <Metric icon={Shuffle} label="Random" value="Active" />
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {attempt.totalQuestions} | {currentQuestion.topic}
          </p>
          <h2 className="mt-3 text-xl font-bold leading-8 text-slate-950 dark:text-white">
            {currentQuestion.question}
          </h2>

          <div className="mt-5 space-y-3">
            {answerLetters.map((letter) => {
              const isSelected = answers[currentQuestion.id] === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  className={`flex w-full gap-3 rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-brand-600 bg-cyan-50 text-brand-900 dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-100'
                      : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-cyan-800'
                  }`}
                  onClick={() => selectAnswer(letter)}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-current text-sm font-bold">
                    {letter}
                  </span>
                  <span className="text-slate-800 dark:text-slate-100">{currentQuestion.options[letter]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
            >
              <ArrowLeft size={16} />
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="secondary" className="gap-2" onClick={skipQuestion}>
                <Flag size={16} />
                Skip
              </Button>
              {currentIndex === attempt.questions.length - 1 ? (
                <Button type="button" className="gap-2" onClick={() => submitTest(false)} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Submit Test
                </Button>
              ) : (
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => setCurrentIndex((index) => Math.min(index + 1, attempt.questions.length - 1))}
                >
                  Next
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </div>
        </article>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold text-slate-950 dark:text-white">Questions</h2>
          <div className="mt-4 grid grid-cols-5 gap-2 lg:grid-cols-4">
            {attempt.questions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                className={`grid size-10 place-items-center rounded-md border text-sm font-bold ${
                  index === currentIndex
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : answeredSet.has(question.id)
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <Button type="button" className="mt-5 w-full gap-2" onClick={() => submitTest(false)} disabled={isSubmitting}>
            <Send size={16} />
            Submit Test
          </Button>
        </aside>
      </div>
    </section>
  );
}

function MockTestResult({ result, leaderboard, onRetake, onNewTest }) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              {result.status === 'autoSubmitted' ? 'Auto submitted' : 'Submitted'}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{result.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Rank #{result.rank?.currentRank ?? '-'} of {result.rank?.totalParticipants ?? '-'} participants
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" className="gap-2" onClick={onRetake}>
              <RotateCcw size={16} />
              Retake
            </Button>
            <Button type="button" className="gap-2" onClick={onNewTest}>
              <Play size={16} />
              New Test
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ResultCard label="Score" value={`${result.score}/${result.totalQuestions}`} />
        <ResultCard label="Accuracy" value={`${result.accuracy}%`} />
        <ResultCard label="Correct" value={result.correctAnswers} tone="text-emerald-700 dark:text-emerald-300" />
        <ResultCard label="Wrong" value={result.wrongAnswers} tone="text-red-700 dark:text-red-300" />
        <ResultCard label="Rank" value={`#${result.rank?.currentRank ?? '-'}`} tone="text-amber-700 dark:text-amber-300" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="space-y-4">
          {result.details.map((item, index) => (
            <article key={item.questionId} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="font-bold leading-7 text-slate-950 dark:text-white">
                  {index + 1}. {item.question}
                </h2>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
                  item.isCorrect
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                }`}>
                  {item.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {item.isSkipped ? 'Skipped' : item.isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                {answerLetters.map((letter) => (
                  <div
                    key={letter}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      letter === item.correctAnswer
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : letter === item.selectedAnswer
                          ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
                          : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {letter}. {item.options[letter]}
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <span className="font-bold">Explanation:</span> {item.explanation}
              </p>
            </article>
          ))}
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-amber-600 dark:text-amber-300" />
            <h2 className="font-bold text-slate-950 dark:text-white">Leaderboard</h2>
          </div>
          <div className="space-y-3">
            {leaderboard.map((item) => (
              <div key={`${item.rank}-${item.student}`} className="flex items-center justify-between rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-md bg-amber-50 font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Medal size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{item.student}</p>
                    <p className="text-slate-500 dark:text-slate-400">{formatTime(item.timeTakenSeconds)}</p>
                  </div>
                </div>
                <p className="font-bold text-slate-950 dark:text-white">#{item.rank}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, value, min, max, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-semibold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
      <Icon size={18} className="text-brand-700 dark:text-cyan-300" />
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-950 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function ResultCard({ label, value, tone = 'text-slate-950 dark:text-white' }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </article>
  );
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds || 0, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const seconds = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
