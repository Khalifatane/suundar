export function PageShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="page-card stack">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
