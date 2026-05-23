import clsx from 'clsx';

export function IconButton({ ariaLabel, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={clsx(
        'grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
