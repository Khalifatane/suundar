import { PageShell } from "@/components/ui/PageShell";

export function PlaceholderPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <PageShell title={title} description={description}>
      {children ?? <p className="muted">This route is scaffolded and ready for feature work.</p>}
    </PageShell>
  );
}
