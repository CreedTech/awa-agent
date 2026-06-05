interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/** Standard page heading for public/tenant pages. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="page-head row between wrap gap-3">
      <div className="col">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="row gap-2">{actions}</div>}
    </div>
  );
}
