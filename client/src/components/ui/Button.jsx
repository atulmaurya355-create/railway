import clsx from 'clsx';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary:
    'border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
};

export function Button({ as: Component = 'button', variant = 'primary', className, children, ...props }) {
  return (
    <Component
      className={clsx(
        'inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
