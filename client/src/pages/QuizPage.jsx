import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { quizService } from '../features/quiz/quizService.js';

export function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const activeQuiz = await quizService.getActiveQuiz();
      setQuiz(activeQuiz);
      setSecondsLeft(activeQuiz.durationSeconds);
    }

    loadQuiz();
  }, []);

  const currentQuestion = quiz?.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = quiz ? Math.round((answeredCount / quiz.questions.length) * 100) : 0;
  const timeTakenSeconds = quiz ? quiz.durationSeconds - secondsLeft : 0;

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const skippedSet = useMemo(() => new Set(skipped), [skipped]);

  useEffect(() => {
    if (!quiz || result) {
      return undefined;
    }

    if (secondsLeft <= 0) {
      handleSubmit();
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz, result, secondsLeft]);

  function selectOption(optionIndex) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionIndex }));
    setSkipped((current) => current.filter((id) => id !== currentQuestion.id));
  }

  function goToPrevious() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function goToNext() {
    setCurrentIndex((index) => Math.min(index + 1, quiz.questions.length - 1));
  }

  function toggleBookmark() {
    setBookmarks((current) =>
      current.includes(currentQuestion.id)
        ? current.filter((id) => id !== currentQuestion.id)
        : [...current, currentQuestion.id],
    );
  }

  function skipQuestion() {
    setAnswers((current) => {
      const nextAnswers = { ...current };
      delete nextAnswers[currentQuestion.id];
      return nextAnswers;
    });
    setSkipped((current) =>
      current.includes(currentQuestion.id) ? current : [...current, currentQuestion.id],
    );
    goToNext();
  }

  async function handleSubmit() {
    if (!quiz || isSubmitting || result) {
      return;
    }

    setIsSubmitting(true);
    const submittedResult = await quizService.submitQuiz({
      answers,
      skippedQuestionIds: skipped,
      bookmarkedQuestionIds: bookmarks,
      timeTakenSeconds,
    });
    setResult(submittedResult);
    setIsSubmitting(false);
  }

  function restartQuiz() {
    setCurrentIndex(0);
    setAnswers({});
    setBookmarks([]);
    setSkipped([]);
    setResult(null);
    setSecondsLeft(quiz.durationSeconds);
  }

  if (!quiz) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Loading quiz...
      </div>
    );
  }

  if (result) {
    return <QuizResult result={result} onRestart={restartQuiz} />;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              Railway Quiz Engine
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{quiz.title}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Metric icon={Clock3} label="Timer" value={formatTime(secondsLeft)} />
            <Metric icon={CheckCircle2} label="Answered" value={`${answeredCount}/${quiz.questions.length}`} />
            <Metric icon={Bookmark} label="Bookmarked" value={bookmarks.length} />
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} of {quiz.questions.length} | {currentQuestion.subject}
              </p>
              <h2 className="mt-2 text-xl font-bold leading-8 text-slate-950 dark:text-white">
                {currentQuestion.question}
              </h2>
            </div>
            <button
              type="button"
              className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium ${
                bookmarkedSet.has(currentQuestion.id)
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={toggleBookmark}
            >
              <Bookmark size={16} aria-hidden="true" />
              Bookmark
            </button>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = answers[currentQuestion.id] === optionIndex;

              return (
                <button
                  key={option}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-brand-600 bg-cyan-50 text-brand-900 dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-800'
                  }`}
                  onClick={() => selectOption(optionIndex)}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-current text-sm font-bold">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="secondary" className="gap-2" onClick={goToPrevious} disabled={currentIndex === 0}>
              <ArrowLeft size={16} aria-hidden="true" />
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="secondary" className="gap-2" onClick={skipQuestion}>
                <Flag size={16} aria-hidden="true" />
                Skip
              </Button>
              {currentIndex === quiz.questions.length - 1 ? (
                <Button type="button" className="gap-2" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                  Submit Quiz
                </Button>
              ) : (
                <Button type="button" className="gap-2" onClick={goToNext}>
                  Next
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </article>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold text-slate-950 dark:text-white">Question Palette</h2>
          <div className="mt-4 grid grid-cols-5 gap-2 lg:grid-cols-4">
            {quiz.questions.map((question, index) => {
              const isActive = index === currentIndex;
              const isAnswered = answers[question.id] !== undefined;
              const isSkipped = skippedSet.has(question.id);
              const isBookmarked = bookmarkedSet.has(question.id);

              return (
                <button
                  key={question.id}
                  type="button"
                  className={`relative grid size-10 place-items-center rounded-md border text-sm font-bold ${
                    isActive
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : isAnswered
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : isSkipped
                          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                  {isBookmarked ? <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-500" /> : null}
                </button>
              );
            })}
          </div>
          <Button type="button" className="mt-5 w-full gap-2" onClick={handleSubmit} disabled={isSubmitting}>
            <Send size={16} aria-hidden="true" />
            Submit Quiz
          </Button>
        </aside>
      </div>
    </section>
  );
}

function QuizResult({ result, onRestart }) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              Quiz Result
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{result.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Score: {result.score}/{result.totalQuestions} | Time: {formatTime(result.timeTakenSeconds)}
            </p>
          </div>
          <Button type="button" variant="secondary" className="gap-2" onClick={onRestart}>
            <RotateCcw size={16} aria-hidden="true" />
            Retake Quiz
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard label="Score" value={`${result.score}/${result.totalQuestions}`} />
        <ResultCard label="Accuracy" value={`${result.accuracy}%`} />
        <ResultCard label="Correct Answers" value={result.correctAnswers} tone="text-emerald-700 dark:text-emerald-300" />
        <ResultCard label="Wrong Answers" value={result.wrongAnswers} tone="text-red-700 dark:text-red-300" />
      </div>

      <div className="space-y-4">
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
                {item.isCorrect ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />}
                {item.isSkipped ? 'Skipped' : item.isCorrect ? 'Correct' : 'Wrong'}
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {item.options.map((option, optionIndex) => (
                <div
                  key={option}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    optionIndex === item.correctOptionIndex
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : optionIndex === item.selectedOptionIndex
                        ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
                        : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
              <span className="font-bold">Explanation:</span> {item.explanation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
      <Icon size={18} className="text-brand-700 dark:text-cyan-300" aria-hidden="true" />
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
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.max(totalSeconds % 60, 0).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
