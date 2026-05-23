import clsx from 'clsx';

const toneClasses = {
  error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300',
  info: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200',
};

export function StatusMessage({ tone = 'info', children }) {
  if (!children) {
    return null;
  }

  return (
    <div className={clsx('rounded-md border px-3 py-2 text-sm leading-6', toneClasses[tone])}>
      {children}
    </div>
  );
}
