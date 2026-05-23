export function AuthCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h1>
        {subtitle ? <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
