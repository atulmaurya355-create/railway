import { Link, Outlet } from 'react-router-dom';
import { TrainFront } from 'lucide-react';
import { ThemeToggle } from '../../../components/theme/ThemeToggle.jsx';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white">
          <span className="grid size-9 place-items-center rounded-md bg-brand-600 text-white">
            <TrainFront size={20} aria-hidden="true" />
          </span>
          <span>Railway Prep</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto grid w-full max-w-6xl px-4 py-8 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-8">
        <section className="hidden space-y-4 lg:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
            Student account
          </p>
          <h1 className="max-w-lg text-4xl font-bold text-slate-950 dark:text-white">
            Keep your preparation, tests, and progress in one secure place.
          </h1>
          <p className="max-w-lg leading-7 text-slate-600 dark:text-slate-300">
            Authentication is ready for learner dashboards, saved attempts, performance analytics,
            and admin-managed exam content.
          </p>
        </section>
        <Outlet />
      </main>
    </div>
  );
}
