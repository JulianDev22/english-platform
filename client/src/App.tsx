import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/store/appStore';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ModulePage = lazy(() => import('@/pages/ModulePage'));
const UnitPage = lazy(() => import('@/pages/UnitPage'));
const ActivityPage = lazy(() => import('@/pages/ActivityPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="modulo/:moduleNumber" element={<ModulePage />} />
            <Route path="modulo/:moduleNumber/unidad/:unitNumber" element={<UnitPage />} />
            <Route
              path="modulo/:moduleNumber/unidad/:unitNumber/actividad/:activityId"
              element={<ActivityPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}
