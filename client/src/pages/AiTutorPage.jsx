import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Brain,
  Clipboard,
  Download,
  History,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { aiTutorService, tutorModes } from '../features/aiTutor/aiTutorService.js';

const modeIcons = {
  doubt: MessageCircleQuestion,
  reasoning: Brain,
  explain: Lightbulb,
  generate: PenLine,
  planner: Target,
  recommend: Sparkles,
};

const starterPrompts = {
  doubt: 'I am confused about time and distance questions in RRB NTPC. Explain the basics.',
  reasoning: 'Solve this reasoning pattern: 3, 8, 15, 24, 35, ?',
  explain: 'Explain why option B is correct for an average question.',
  generate: 'Generate 5 medium-level railway reasoning MCQs with answers.',
  planner: 'Create a 14-day study planner for RRB NTPC with 2 hours daily.',
  recommend: 'Recommend what I should study next based on weak maths and reasoning.',
};

export function AiTutorPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('doubt');
  const [input, setInput] = useState(starterPrompts.doubt);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const bottomRef = useRef(null);

  const activeMode = tutorModes.find((item) => item.id === mode);
  const transcript = useMemo(
    () =>
      messages
        .map((message) => `${message.role === 'user' ? 'Student' : 'AI Tutor'}:\n${message.content}`)
        .join('\n\n---\n\n'),
    [messages],
  );

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function loadSessions() {
    try {
      const data = await aiTutorService.listSessions();
      setSessions(data);
    } catch (_error) {
      setSessions([]);
    }
  }

  async function openSession(sessionId) {
    const session = await aiTutorService.getSession(sessionId);
    setActiveSessionId(session._id ?? session.id);
    setMessages(session.messages ?? []);
    setMode(session.lastMode ?? 'doubt');
  }

  function startNewChat() {
    setActiveSessionId('');
    setMessages([]);
    setMode('doubt');
    setInput(starterPrompts.doubt);
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setInput(starterPrompts[nextMode]);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (!input.trim() || isTyping) {
      return;
    }

    const userMessage = {
      _id: `local-user-${Date.now()}`,
      role: 'user',
      mode,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await aiTutorService.ask({
        sessionId: activeSessionId || undefined,
        mode,
        message: userMessage.content,
        context: {
          examTarget: user?.examTarget,
        },
      });

      setActiveSessionId(data.session.id);
      setMessages((current) => [...current, data.assistantMessage]);
      await loadSessions();
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          _id: `local-error-${Date.now()}`,
          role: 'assistant',
          mode,
          content: error.message ?? 'Unable to reach AI Tutor. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function copyMessage(message) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message._id);
    window.setTimeout(() => setCopiedId(''), 1400);
  }

  function downloadChat() {
    const blob = new Blob([transcript || 'No chat messages yet.'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `railway-ai-tutor-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function deleteSession(sessionId) {
    await aiTutorService.deleteSession(sessionId);
    if (sessionId === activeSessionId) {
      startNewChat();
    }
    await loadSessions();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
              AI Tutor
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Ask doubts, solve questions, and plan smarter.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Powered by the OpenAI API with chat history, tutor modes, copy, download, and personalized context.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="gap-2" onClick={downloadChat}>
              <Download size={16} aria-hidden="true" />
              Download Chat
            </Button>
            <Button type="button" className="gap-2" onClick={startNewChat}>
              <Plus size={16} aria-hidden="true" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[18rem_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <History size={18} className="text-brand-700 dark:text-cyan-300" aria-hidden="true" />
            <h2 className="font-bold text-slate-950 dark:text-white">Chat History</h2>
          </div>
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                No previous chats yet.
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group rounded-md border p-3 ${
                    activeSessionId === session.id
                      ? 'border-brand-600 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-950/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openSession(session.id)}
                  >
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{session.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {session.preview || 'Open chat'}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-300"
                    onClick={() => deleteSession(session.id)}
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tutorModes.map((item) => {
                const Icon = modeIcons[item.id];

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      mode === item.id
                        ? 'border-brand-600 bg-cyan-50 text-brand-800 dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-100'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => changeMode(item.id)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[34rem] space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            {messages.length === 0 ? (
              <div className="grid h-full place-items-center text-center">
                <div className="max-w-md">
                  <span className="mx-auto mb-4 grid size-14 place-items-center rounded-lg bg-brand-600 text-white">
                    <Bot size={28} aria-hidden="true" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">{activeMode?.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Choose a mode, ask your doubt, and the tutor will respond with exam-focused guidance.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatBubble
                  key={message._id}
                  message={message}
                  copied={copiedId === message._id}
                  onCopy={() => copyMessage(message)}
                />
              ))
            )}
            {isTyping ? <TypingBubble /> : null}
            <div ref={bottomRef} />
          </div>

          <form className="border-t border-slate-200 p-4 dark:border-slate-800" onSubmit={sendMessage}>
            <div className="flex flex-col gap-3 lg:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                className="min-h-24 flex-1 resize-none rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Ask a doubt, paste a reasoning question, request a study plan..."
              />
              <Button type="submit" className="gap-2 lg:self-end" disabled={isTyping || !input.trim()}>
                {isTyping ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ message, copied, onCopy }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <article
        className={`max-w-3xl rounded-lg border p-4 shadow-sm ${
          isUser
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wide opacity-80">
            {isUser ? 'You' : 'AI Tutor'}
          </p>
          {!isUser ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 dark:text-cyan-300"
              onClick={onCopy}
            >
              <Clipboard size={13} aria-hidden="true" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          ) : null}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
      </article>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Bot size={16} aria-hidden="true" />
          AI Tutor is typing
          <span className="flex gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-brand-600" />
            <span className="size-1.5 animate-bounce rounded-full bg-brand-600 [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-brand-600 [animation-delay:240ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}
