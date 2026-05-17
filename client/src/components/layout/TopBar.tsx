import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function TopBar() {
  const { theme, setTheme, toggleSidebar } = useAppStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (data.length > 0) {
          const completed = data.filter((p) => p.completed).length;
          setProgress(Math.round((completed / data.length) * 100));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="fixed top-0 right-0 left-72 z-30 flex h-14 items-center justify-between border-b border-border bg-surface-1/80 backdrop-blur-lg px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          Inicio
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {progress > 0 && (
          <span className="text-xs text-text-secondary">{progress}% completo</span>
        )}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
