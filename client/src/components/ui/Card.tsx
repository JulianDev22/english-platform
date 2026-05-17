import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  href?: string;
  children?: ReactNode;
  progress?: number;
  className?: string;
}

export function Card({ title, subtitle, icon, href, children, progress, className = '' }: CardProps) {
  const content = (
    <div
      className={`group rounded-xl border border-border bg-surface-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${className}`}
    >
      {progress !== undefined && (
        <div className="mb-3 h-1 w-full rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary truncate">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="mt-3 text-sm text-text-secondary">{children}</div>}
    </div>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }

  return content;
}
