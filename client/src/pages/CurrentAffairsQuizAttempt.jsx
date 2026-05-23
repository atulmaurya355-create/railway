import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { currentAffairsService } from '../features/currentAffairs/currentAffairsService.js';

export const CurrentAffairsQuizAttempt = ({ quiz }) => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(quiz);
  const [loading, setLoading] = useState(!quiz);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!quiz && quizId) {
      const fetchQuiz = async () => {
        try {
          setLoading(true);
          const response = await currentAffairsService.getQuizById(quizId);
          setQuizData(response.data.quiz);
          setError(null);
        } catch (err) {
          setError('Failed to load quiz');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [quizId, quiz]);

  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const duration = quizData?.duration * 60;
    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStarted, quizSubmitted, quizData]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setAnswers({});
  };

  const handleSelectAnswer = (questionIndex, selectedOptions) => {
    setAnswers({
      ...answers,
      [questionIndex]: selectedOptions,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const answersArray = Object.entries(answers).map(([index, selected]) => ({
        questionIndex: parseInt(index),
        selectedOptions: Array.isArray(selected) ? selected : [selected],
      }));

      const duration = Math.round((Date.now() - startTime) / 1000);

      const response = await currentAffairsService.submitQuiz(quizData._id, answersArray, duration);

      setResult(response.data.result);
      setQuizSubmitted(true);
    } catch (err) {
      setError('Failed to submit quiz');
      console.error(err);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizStarted(false);
    setQuizSubmitted(false);
    setResult(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin inline-flex h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400">
            {error || 'Quiz not found'}
          </div>
        </div>
      </div>
    );
  }

  if (quizSubmitted && result) {
    const percentage = parseFloat(result.percentage);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Quiz Completed!</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Score</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.totalMarksObtained}/{result.totalMarks}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Percentage
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {percentage.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Correct</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {result.correctAnswers}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Incorrect
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {result.incorrectAnswers}
                </p>
              </div>
            </div>

            <div
              className={`p-6 rounded-lg mb-8 text-center text-white font-bold text-lg ${
                result.isPassed ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {result.isPassed ? '✓ PASSED' : '✗ FAILED'} - Passing Score: {quizData.passingScore}%
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetakeQuiz}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw size={20} />
                Retake Quiz
              </button>
              <button
                onClick={() => navigate('/current-affairs/quiz')}
                className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8 font-medium"
          >
            <ChevronLeft size={20} />
            Back to Quizzes
          </button>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {quizData.title}
            </h1>
            {quizData.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {quizData.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Questions
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {quizData.questions?.length || 0}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Duration
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {quizData.duration}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">minutes</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">
                  Passing Score
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {quizData.passingScore}%
                </p>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Question {currentQuestion + 1}/{quizData.questions.length}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold text-red-600 dark:text-red-400">
            <Clock size={24} />
            {formatTime(timeLeft || 0)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Question Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {question.questionText}
          </h3>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => {
              const isSelected =
                answers[currentQuestion]?.includes(option.text) ||
                (Array.isArray(answers[currentQuestion])
                  ? answers[currentQuestion].includes(option.text)
                  : false);

              return (
                <label
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input
                    type={question.questionType === 'multiselect' ? 'checkbox' : 'radio'}
                    name={`question-${currentQuestion}`}
                    checked={isSelected}
                    onChange={(e) => {
                      if (question.questionType === 'multiselect') {
                        const current = Array.isArray(answers[currentQuestion])
                          ? answers[currentQuestion]
                          : [];
                        if (e.target.checked) {
                          handleSelectAnswer(currentQuestion, [...current, option.text]);
                        } else {
                          handleSelectAnswer(
                            currentQuestion,
                            current.filter((o) => o !== option.text)
                          );
                        }
                      } else {
                        handleSelectAnswer(currentQuestion, option.text);
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-900 dark:text-white">{option.text}</span>
                </label>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentQuestion === quizData.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Jump to Question</h4>
          <div className="grid grid-cols-10 gap-2">
            {quizData.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded font-semibold text-sm transition-all ${
                  idx === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[idx]
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsQuizAttempt;
