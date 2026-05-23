import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-cyan-300">
        404
      </p>
      <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Page not found</h1>
      <p className="text-slate-600 dark:text-slate-300">
        This route does not exist yet. Future exam modules can be added from the routing layer.
      </p>
      <Button as={Link} to="/">
        Back home
      </Button>
    </section>
  );
}
