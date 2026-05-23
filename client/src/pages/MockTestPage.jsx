import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  User,
  Monitor,
  Volume2
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { mockTestService } from '../features/mockTests/mockTestService.js';
import canvasConfetti from 'canvas-confetti';

const answerLetters = ['A', 'B', 'C', 'D'];

export function MockTestPage() {
  const [config, setConfig] = useState(null);
  const [setup, setSetup] = useState({
    testType: 'fullLength',
    category: '',
    topic: '',
    questionCount: 8,
    durationMinutes: 12,
  });
  
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dual Mock Test Console Mode: 'futuristic' vs 'official'
  const [examConsoleMode, setExamConsoleMode] = useState('futuristic');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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

  // Track visited questions
  useEffect(() => {
    if (attempt && currentQuestion) {
      setVisitedQuestions((prev) => {
        const next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });
    }
  }, [attempt, currentIndex, currentQuestion]);

  // Clock countdown with warnings
  useEffect(() => {
    if (!attempt || result) return undefined;

    if (secondsLeft <= 0) {
      submitTest(true);
      return undefined;
    }

    // Alarm ticking triggers when 5 minutes (300 secs) or less
    const isAlarmTriggered = secondsLeft <= 300;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, result, secondsLeft]);

  async function startTest(event) {
    event.preventDefault();
    setIsStarting(true);
    const startedAttempt = await mockTestService.startTest(setup);
    
    // Inject mock questions topic if empty
    const enrichedQuestions = startedAttempt.questions.map((q, idx) => ({
      ...q,
      topic: q.topic || (idx % 2 === 0 ? 'Mathematics' : idx % 3 === 0 ? 'General Intelligence' : 'General Science'),
    }));
    startedAttempt.questions = enrichedQuestions;

    setAttempt(startedAttempt);
    setAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set([enrichedQuestions[0]?.id]));
    setCurrentIndex(0);
    setResult(null);
    setSecondsLeft(startedAttempt.durationSeconds);
    setIsStarting(false);
  }

  function selectAnswer(answer) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: answer }));
  }

  function clearResponse() {
    setAnswers((current) => {
      const next = { ...current };
      delete next[currentQuestion.id];
      return next;
    });
  }

  function toggleMarkForReview() {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  }

  function handleSaveAndNext() {
    // Save response and move forward
    setCurrentIndex((index) => Math.min(index + 1, attempt.questions.length - 1));
  }

  async function submitTest(isAutoSubmitted = false) {
    if (!attempt || isSubmitting || result) return;

    setIsSubmitting(true);
    setShowSubmitModal(false);
    
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

    // Trigger gamified level-up celebration confetti!
    canvasConfetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  function resetTest() {
    setAttempt(null);
    setResult(null);
    setAnswers({});
    setMarkedForReview(new Set());
    setVisitedQuestions(new Set());
    setCurrentIndex(0);
    setSecondsLeft(0);
  }

  if (!config) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
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
          setMarkedForReview(new Set());
          setVisitedQuestions(new Set([attempt.questions[0]?.id]));
          setCurrentIndex(0);
          setSecondsLeft(attempt.durationSeconds);
        }}
        onNewTest={resetTest}
      />
    );
  }

  // CONFIGURATION VIEW (Start mockup)
  if (!attempt) {
    return (
      <section className="space-y-6">
        
        {/* Module Brand Banner */}
        <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-950 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/25">
              <Sparkles size={11} className="text-railway-gold animate-bounce" />
              <span>Shatabdi Test Engine</span>
            </span>
            <h1 className="text-3xl font-black tracking-tight">Active CBT Mock Station</h1>
            <p className="max-w-2xl text-xs text-slate-400 font-semibold leading-relaxed">
              Launch sectional speed drills or full-length CBT revisions. Practice inside exact official layouts with countdown signals and negative marking warnings.
            </p>
          </div>
        </div>

        {/* Start setup Form */}
        <form
          className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-xl lg:grid-cols-[1fr_22rem]"
          onSubmit={startTest}
        >
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {config.testTypes.map((testType) => (
                <button
                  key={testType.id}
                  type="button"
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    setup.testType === testType.id
                      ? 'border-cyan-500 bg-cyan-500/5 dark:border-cyan-500 dark:bg-[#0a1128]/80 shadow-lg shadow-cyan-500/5'
                      : 'border-slate-200 hover:border-cyan-550/20 dark:border-slate-800 dark:hover:border-cyan-500/10'
                  }`}
                  onClick={() =>
                    setSetup((current) => ({
                      ...current,
                      testType: testType.id,
                      questionCount: Math.min(testType.defaultQuestionCount, 8),
                      durationMinutes: testType.defaultDurationMinutes,
                    }))
                  }
                >
                  <span className="mb-4 grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-railway-blue to-cyan-500 text-white shadow-md">
                    {testType.id === 'fullLength' ? <TimerReset size={18} /> : <BarChart3 size={18} />}
                  </span>
                  <h2 className="font-extrabold text-sm text-slate-950 dark:text-white leading-tight">{testType.title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                    {testType.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Exam Track"
                value={setup.category}
                onChange={(value) => setSetup((current) => ({ ...current, category: value }))}
                options={config.categories}
                placeholder="All Categories"
              />
              <SelectField
                label="Topic Subject"
                value={setup.topic}
                onChange={(value) => setSetup((current) => ({ ...current, topic: value }))}
                options={config.topics}
                placeholder="All Subjects"
              />
              <NumberField
                label="Syllabus Questions Count"
                value={setup.questionCount}
                min={1}
                max={40}
                onChange={(value) => setSetup((current) => ({ ...current, questionCount: value }))}
              />
              <NumberField
                label="Mock Duration Minutes"
                value={setup.durationMinutes}
                min={1}
                max={120}
                onChange={(value) => setSetup((current) => ({ ...current, durationMinutes: value }))}
              />
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-950 dark:text-white">Active Route Summary</h2>
              
              <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-350 font-semibold">
                <SummaryRow label="Test Mode" value={setup.testType === 'fullLength' ? 'Full Length' : 'Sectional speed'} />
                <SummaryRow label="Total Questions" value={`${setup.questionCount} Qs`} />
                <SummaryRow label="Diagnostic Duration" value={`${setup.durationMinutes} Mins`} />
                <SummaryRow label="Target Route" value={setup.topic || setup.category || 'Random Aptitude'} />
              </div>
            </div>
            
            <Button type="submit" className="mt-6 w-full h-11 rounded-xl bg-gradient-to-r from-railway-blue to-cyan-500 hover:brightness-110 text-white font-extrabold text-xs shadow-md border-none flex items-center justify-center gap-1.5" disabled={isStarting}>
              {isStarting ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
              <span>Launch Mock Test</span>
            </Button>
          </aside>
        </form>
      </section>
    );
  }

  // MOCK TEST SCREEN (Active attempt)
  const isTimeUrgent = secondsLeft <= 300; // Warning ticks active when <= 5 mins

  return (
    <div className="space-y-6">
      
      {/* Shell Control Bar: Style switches */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 to-slate-950 text-white shadow-lg gap-4">
        
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">
            <Monitor size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Console Style Deck</p>
            <p className="text-xs font-black text-white mt-0.5">Toggle Simulator Views</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual-Mode Toggle button */}
          <button
            onClick={() => setExamConsoleMode(examConsoleMode === 'futuristic' ? 'official' : 'futuristic')}
            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-railway-blue to-cyan-500 text-white shadow-md hover:brightness-110 active:scale-95 transition"
          >
            Switch to {examConsoleMode === 'futuristic' ? 'Official CBT Layout' : 'Futuristic cockpit'}
          </button>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="h-9 px-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {examConsoleMode === 'futuristic' ? (
          
          /* VIEW 1: FUTURISTIC COCKPIT (Sleek dark, glowing gradient panels) */
          <motion.div
            key="futuristic-cockpit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header statistics panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-bl-full" />
              
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    <Sparkles size={11} className="animate-spin-slow" />
                    <span>Active cockpit simulation</span>
                  </span>
                  <h1 className="mt-2 text-2xl font-black leading-tight text-white">{attempt.title}</h1>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-3 shrink-0">
                  <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    isTimeUrgent 
                      ? 'border-rose-500 bg-rose-500/10 text-rose-400 animate-pulse' 
                      : 'border-slate-800 bg-slate-950/40 text-amber-400'
                  }`}>
                    <Clock3 size={18} className={isTimeUrgent ? 'animate-bounce' : 'animate-spin-slow'} />
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">Countdown</p>
                      <p className="text-sm font-black font-mono">{formatTime(secondsLeft)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-emerald-400">
                    <CheckCircle2 size={18} />
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">Answered</p>
                      <p className="text-sm font-black">{answeredCount}/{attempt.totalQuestions}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-cyan-400">
                    <Shuffle size={18} />
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">Accuracy index</p>
                      <p className="text-sm font-black">Smart</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-railway-blue to-cyan-500 transition-all duration-300 shadow-md shadow-cyan-500/20" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
              
              {/* Question board left */}
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Question {currentIndex + 1} of {attempt.totalQuestions} | {currentQuestion.topic}
                  </span>
                  
                  {markedForReview.has(currentQuestion.id) && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-[9px] border border-purple-500/15 animate-pulse">
                      🚩 Marked for Review
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
                  {selectedLanguage === 'English' ? currentQuestion.question : `[हिन्दी अनुवाद]: ${currentQuestion.question}`}
                </h2>

                {/* Question choices */}
                <div className="mt-6 space-y-3">
                  {answerLetters.map((letter) => {
                    const isSelected = answers[currentQuestion.id] === letter;
                    return (
                      <button
                        key={letter}
                        type="button"
                        className={`flex w-full gap-3.5 rounded-xl border p-4.5 text-left font-semibold transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-500/5 text-cyan-700 dark:border-cyan-400 dark:bg-[#0a1128]/60 dark:text-cyan-300 shadow-md shadow-cyan-500/5'
                            : 'border-slate-200 hover:border-cyan-500/15 hover:bg-slate-50 dark:border-slate-850 dark:hover:border-cyan-500/10'
                        }`}
                        onClick={() => selectAnswer(letter)}
                      >
                        <span className={`grid size-7.5 shrink-0 place-items-center rounded-lg border border-current text-xs font-black transition-all ${
                          isSelected ? 'bg-current text-white dark:text-slate-950' : 'text-slate-400'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 text-sm">
                          {currentQuestion.options[letter]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom control button options */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-1.5 px-4 h-10 rounded-xl text-xs font-bold"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </Button>
                  
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className={`gap-1.5 px-4 h-10 rounded-xl text-xs font-bold ${
                        markedForReview.has(currentQuestion.id) ? 'bg-purple-500/10 text-purple-600 border-purple-500/25' : ''
                      }`} 
                      onClick={toggleMarkForReview}
                    >
                      <Flag size={14} />
                      {markedForReview.has(currentQuestion.id) ? 'Unmark review' : 'Mark for Review'}
                    </Button>

                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="gap-1.5 px-4 h-10 rounded-xl text-xs font-bold text-railway-red" 
                      onClick={clearResponse}
                    >
                      Clear response
                    </Button>
                    
                    {currentIndex === attempt.questions.length - 1 ? (
                      <Button 
                        type="button" 
                        className="gap-1.5 px-5 h-10 rounded-xl bg-gradient-to-r from-railway-blue to-cyan-500 border-none text-white font-extrabold text-xs shadow-md hover:brightness-110" 
                        onClick={() => setShowSubmitModal(true)} 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Submit CBT mock
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="gap-1.5 px-5 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-md"
                        onClick={handleSaveAndNext}
                      >
                        Next question
                        <ArrowRight size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </article>

              {/* Palette index sidebar right */}
              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-xl">
                <h2 className="font-extrabold text-sm text-slate-950 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Question Palette
                </h2>
                
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {attempt.questions.map((question, index) => {
                    const isCurrent = index === currentIndex;
                    const isAnswered = answeredSet.has(question.id);
                    const isMarked = markedForReview.has(question.id);

                    let btnStyles = 'border-slate-200 text-slate-655 dark:border-slate-850 dark:text-slate-350';
                    if (isCurrent) {
                      btnStyles = 'border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-500/15';
                    } else if (isMarked) {
                      btnStyles = 'border-purple-550 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 animate-pulse';
                    } else if (isAnswered) {
                      btnStyles = 'border-emerald-250 bg-emerald-500/10 text-emerald-600 dark:border-emerald-950/40 dark:text-emerald-400 border-emerald-500/15';
                    } else if (visitedQuestions.has(question.id)) {
                      btnStyles = 'border-rose-250 bg-rose-500/10 text-rose-500 border-rose-500/15';
                    }

                    return (
                      <button
                        key={question.id}
                        type="button"
                        className={`grid size-9.5 place-items-center rounded-xl border text-xs font-black transition-all ${btnStyles}`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 space-y-2.5">
                  <div className="flex items-center gap-2"><span className="size-3.5 rounded bg-cyan-500 shrink-0" /><span>Active current</span></div>
                  <div className="flex items-center gap-2"><span className="size-3.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0" /><span>Answered Qs</span></div>
                  <div className="flex items-center gap-2"><span className="size-3.5 rounded bg-purple-500/10 border border-purple-500/20 shrink-0" /><span>Flagged for Review</span></div>
                  <div className="flex items-center gap-2"><span className="size-3.5 rounded bg-rose-500/10 border border-rose-500/20 shrink-0" /><span>Visited & Unanswered</span></div>
                  <div className="flex items-center gap-2"><span className="size-3.5 rounded bg-white border border-slate-200 shrink-0" /><span>Not Visited</span></div>
                </div>

                <Button 
                  type="button" 
                  className="mt-6 w-full h-10 rounded-xl bg-gradient-to-r from-railway-blue to-cyan-500 border-none text-white font-extrabold text-xs shadow-md" 
                  onClick={() => setShowSubmitModal(true)} 
                  disabled={isSubmitting}
                >
                  <Send size={13} />
                  <span>Submit Attempt</span>
                </Button>
              </aside>

            </div>
          </motion.div>
        ) : (
          
          /* VIEW 2: OFFICIAL RRB CBT LAYOUT (Simulates the actual Indian Railways software) */
          <motion.div
            key="official-cbt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="border-2 border-slate-350 dark:border-slate-700 bg-slate-100 text-slate-850 rounded-lg overflow-hidden shadow-2xl font-sans"
          >
            
            {/* Top Official Candidate verification strip */}
            <div className="bg-[#1e3a8a] text-white px-5 py-3 flex justify-between items-center border-b-4 border-[#f59e0b]">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base uppercase tracking-tight">RRB ONLINE CBT CONSOLE</span>
              </div>
              
              {/* Profile Card overlay on the right */}
              <div className="flex items-center gap-3 bg-[#111827]/40 px-4 py-1.5 rounded-md border border-white/10 text-xs font-semibold">
                <div className="grid size-9 place-items-center bg-slate-700 rounded overflow-hidden shadow-inner border border-white/20">
                  <User size={18} className="text-slate-350" />
                </div>
                <div>
                  <p className="text-white font-bold leading-tight">{user?.name || 'Candidate profile'}</p>
                  <p className="text-[10px] text-slate-300">Roll: RRB-2026-MOCK</p>
                </div>
              </div>
            </div>

            {/* Official Subject & Timer Ribbon */}
            <div className="bg-slate-200 px-5 py-2.5 border-b border-slate-350 flex justify-between items-center text-xs text-slate-750 font-bold">
              <div>
                <span>Subject: <strong className="text-slate-900">{attempt.title}</strong></span>
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded border ${
                isTimeUrgent ? 'border-red-500 bg-red-100 text-red-700 animate-pulse font-black' : 'border-slate-350 bg-white text-[#1e3a8a]'
              }`}>
                <Clock3 size={14} className={isTimeUrgent ? 'animate-bounce' : ''} />
                <span>Time Left: <strong className="font-mono">{formatTime(secondsLeft)}</strong></span>
              </div>
            </div>

            {/* Left-Right grid setup split: Left Question, Right palette */}
            <div className="grid md:grid-cols-[1fr_20rem] min-h-[480px]">
              
              {/* Left Question Chassis */}
              <div className="p-6 bg-white flex flex-col justify-between border-r border-slate-350">
                
                <div className="space-y-4">
                  <div className="pb-2.5 border-b border-slate-200 flex justify-between text-xs font-bold text-slate-600">
                    <span>Question Type: Multiple Choice Single Correct</span>
                    <span className="text-[#d32f2f] uppercase tracking-wide">Negative marking: 1/3 Marks</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="font-extrabold text-[#1e3a8a] text-sm py-0.5 px-2 rounded bg-slate-100 border border-slate-300 shrink-0">
                      Q {currentIndex + 1}
                    </span>
                    
                    <div className="space-y-4 flex-1">
                      <p className="font-bold text-[15px] leading-relaxed text-slate-900">
                        {selectedLanguage === 'English' ? currentQuestion.question : `[हिन्दी अनुवाद]: ${currentQuestion.question}`}
                      </p>
                      
                      {/* Radio button options */}
                      <div className="space-y-2 mt-4 max-w-2xl">
                        {answerLetters.map((letter) => {
                          const isSelected = answers[currentQuestion.id] === letter;
                          return (
                            <label
                              key={letter}
                              className={`flex items-center gap-3.5 p-3 rounded-md border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] font-extrabold'
                                  : 'border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="options"
                                value={letter}
                                checked={isSelected}
                                onChange={() => selectAnswer(letter)}
                                className="accent-[#1e3a8a] h-4.5 w-4.5"
                              />
                              <span className="font-black text-[#1e3a8a] text-xs">{letter}.</span>
                              <span className="text-slate-800 text-[13px]">{currentQuestion.options[letter]}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom official CBT buttons */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap gap-2.5 justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleMarkForReview}
                      className="px-4 py-2 text-xs font-bold border border-purple-500 text-purple-650 bg-purple-50 rounded shadow-sm hover:bg-purple-100"
                    >
                      Mark for Review & Next
                    </button>
                    <button
                      onClick={clearResponse}
                      className="px-4 py-2 text-xs font-bold border border-slate-300 text-slate-700 bg-white rounded shadow-sm hover:bg-slate-50"
                    >
                      Clear Response
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 text-xs font-bold border border-slate-300 text-slate-700 bg-white rounded disabled:opacity-40"
                    >
                      Back
                    </button>
                    
                    {currentIndex === attempt.questions.length - 1 ? (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-5 py-2 text-xs font-black bg-[#d32f2f] text-white rounded shadow-md hover:bg-red-750"
                      >
                        Submit Exam
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveAndNext}
                        className="px-5 py-2 text-xs font-black bg-[#1e3a8a] text-white rounded shadow-md hover:bg-blue-800"
                      >
                        Save & Next
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Official Palette panels */}
              <div className="p-5 bg-slate-200 flex flex-col justify-between border-t md:border-t-0 border-slate-350">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-tight border-b border-slate-300 pb-2 mb-3">
                    Question Palette
                  </h3>

                  {/* Summary metric grid box */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-655 bg-white p-3 rounded-lg border border-slate-300 mb-4">
                    <div className="flex items-center gap-1.5"><span className="grid size-4 place-items-center bg-emerald-600 text-white rounded-sm text-[8px] font-black">A</span><span>{answeredCount} Answered</span></div>
                    <div className="flex items-center gap-1.5"><span className="grid size-4 place-items-center bg-[#d32f2f] text-white rounded-sm text-[8px] font-black">NA</span><span>{attempt.totalQuestions - answeredCount} Unanswered</span></div>
                    <div className="flex items-center gap-1.5"><span className="grid size-4 place-items-center bg-purple-600 text-white rounded-full text-[8px] font-black">R</span><span>{markedForReview.size} Reviewed</span></div>
                    <div className="flex items-center gap-1.5"><span className="grid size-4 place-items-center bg-slate-300 text-slate-800 rounded-sm text-[8px] font-black">V</span><span>{visitedQuestions.size} Visited</span></div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {attempt.questions.map((question, index) => {
                      const isCurrent = index === currentIndex;
                      const isAnswered = answeredSet.has(question.id);
                      const isMarked = markedForReview.has(question.id);

                      let shapeStyles = 'bg-white border-slate-300 text-slate-700';
                      if (isCurrent) {
                        shapeStyles = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300';
                      } else if (isMarked) {
                        shapeStyles = 'bg-purple-650 text-white border-purple-650 rounded-full';
                      } else if (isAnswered) {
                        // Official Answered is curved green shape
                        shapeStyles = 'bg-emerald-600 text-white border-emerald-600 rounded-t-lg rounded-b-sm';
                      } else if (visitedQuestions.has(question.id)) {
                        // Official Not Answered is curved red shape
                        shapeStyles = 'bg-[#d32f2f] text-white border-[#d32f2f] rounded-b-lg rounded-t-sm';
                      }

                      return (
                        <button
                          key={question.id}
                          onClick={() => setCurrentIndex(index)}
                          className={`grid size-8.5 place-items-center border text-xs font-black shadow-xs ${shapeStyles}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-2.5 text-xs font-black uppercase bg-[#1e3a8a] text-white rounded shadow-md hover:bg-blue-800"
                  >
                    Submit Test Paper
                  </button>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBMIT CONFIRMATION DRAWER/MODAL OVERLAY */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setShowSubmitModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 text-center space-y-4"
            >
              <span className="grid size-12 place-items-center bg-cyan-500/10 text-cyan-500 rounded-full mx-auto animate-pulse">
                <HelpCircle size={24} />
              </span>
              
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Submit Mock Test Confirmation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                You are about to submit your RRB exam mock attempt. Review your completion metrics summary below before finalize:
              </p>
              
              <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 text-xs font-bold text-slate-655">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">Completed</p>
                  <p className="text-base font-black text-emerald-500 mt-1">{answeredCount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">Flagged</p>
                  <p className="text-base font-black text-purple-500 mt-1">{markedForReview.size}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">Unvisited</p>
                  <p className="text-base font-black text-rose-500 mt-1">{attempt.totalQuestions - visitedQuestions.size}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitTest(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-black bg-gradient-to-r from-railway-blue to-cyan-500 text-white rounded-xl shadow-md hover:brightness-110 active:scale-95 transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MockTestResult({ result, leaderboard, onRetake, onNewTest }) {
  return (
    <section className="space-y-6">
      
      {/* Result Brand Banner Card */}
      <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-950 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-bl-full" />
        
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/25 w-fit">
              {result.status === 'autoSubmitted' ? 'Time expired auto submitted' : 'CBT Paper resolved'}
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-white">{result.title}</h1>
            <p className="mt-1 text-slate-400 font-semibold text-xs">
              Aspirant diagnostics rank: #{result.rank?.currentRank ?? '-'} of {result.rank?.totalParticipants ?? '-'} candidates
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <Button type="button" variant="secondary" className="gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-white text-slate-800 hover:bg-slate-50 border-slate-200" onClick={onRetake}>
              <RotateCcw size={14} />
              <span>Retake drill</span>
            </Button>
            <Button type="button" className="gap-1.5 h-10 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-railway-blue to-cyan-500 text-white border-none" onClick={onNewTest}>
              <Play size={14} />
              <span>New Mock Station</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Glowing Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ResultCard label="Accrued Score" value={`${result.score}/${result.totalQuestions}`} />
        <ResultCard label="Test Accuracy" value={`${result.accuracy}%`} />
        <ResultCard label="Correct Answers" value={result.correctAnswers} tone="text-emerald-500" />
        <ResultCard label="Wrong Selections" value={result.wrongAnswers} tone="text-rose-500" />
        <ResultCard label="Predicted Rank" value={`#${result.rank?.currentRank ?? '-'}`} tone="text-amber-500" />
      </div>

      {/* Answer key list & Leaderboard split panel */}
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        
        {/* Solutions key list left */}
        <section className="space-y-4">
          <div className="pb-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">Explanatory Answer Key</h3>
            <p className="text-xs text-slate-450 font-semibold mt-0.5">Detailed breakdown of answers with scientific calculations</p>
          </div>

          {result.details.map((item, index) => (
            <article key={item.questionId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="font-extrabold text-sm leading-relaxed text-slate-900 dark:text-white pr-4">
                  {index + 1}. {item.question}
                </h2>
                
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black border uppercase shrink-0 ${
                  item.isCorrect
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-350 dark:border-emerald-900/30'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-350 dark:border-rose-900/30'
                }`}>
                  {item.isCorrect ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  <span>{item.isSkipped ? 'Skipped' : item.isCorrect ? 'Correct' : 'Incorrect'}</span>
                </span>
              </div>
              
              <div className="mt-4 grid gap-2">
                {answerLetters.map((letter) => {
                  const isCorrect = letter === item.correctAnswer;
                  const isSelected = letter === item.selectedAnswer;
                  
                  let borderStyle = 'border-slate-200 text-slate-655 dark:border-slate-850 dark:text-slate-350';
                  if (isCorrect) {
                    borderStyle = 'border-emerald-300 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    borderStyle = 'border-rose-300 bg-rose-50/50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-300 font-bold';
                  }

                  return (
                    <div
                      key={letter}
                      className={`rounded-xl border px-3.5 py-2.5 text-xs ${borderStyle}`}
                    >
                      <span className="font-black mr-2">{letter}.</span>
                      <span>{item.options[letter]}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4.5 text-xs leading-relaxed text-slate-700 dark:bg-slate-950/70 dark:text-slate-350 border border-slate-150 dark:border-slate-850 font-medium">
                <span className="font-extrabold text-slate-950 dark:text-white flex items-center gap-1 mb-1">
                  <Lightbulb size={13} className="text-railway-gold shrink-0" />
                  <span>CBT Explanation:</span>
                </span>
                <p>{item.explanation}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Leaderboard side right */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-xl shrink-0 self-start">
          <div className="mb-4 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Trophy size={18} className="text-amber-500" />
            <h2 className="font-extrabold text-sm text-slate-950 dark:text-white">Active Benchmarks</h2>
          </div>
          
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((item) => (
                <div key={`${item.rank}-${item.student}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-700 border border-amber-250/20 dark:bg-amber-950/40 dark:text-amber-300">
                      <Medal size={15} />
                    </span>
                    <div>
                      <p className="font-black text-slate-950 dark:text-white truncate max-w-28">{item.student}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">{formatTime(item.timeTakenSeconds)}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-slate-950 dark:text-white">#{item.rank}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 font-bold text-xs">
                No comparative benchmarks locked.
              </div>
            )}
          </div>
        </aside>

      </div>
    </section>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
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
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-semibold text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-extrabold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}

function ResultCard({ label, value, tone = 'text-slate-950 dark:text-white' }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-slate-100 dark:via-slate-800 to-transparent" />
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`mt-2 text-2xl font-black leading-none ${tone}`}>{value}</p>
    </article>
  );
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds || 0, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
  const seconds = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getInitials(name = 'Student') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
