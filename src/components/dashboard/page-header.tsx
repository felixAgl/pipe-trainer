interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-pt-accent/20 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            <span className="text-pt-accent">//</span> {title}
          </h1>
          {description && <p className="mt-1 text-sm text-pt-muted">{description}</p>}
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </div>
  );
}
