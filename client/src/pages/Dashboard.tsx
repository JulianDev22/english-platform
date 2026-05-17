import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Module } from '@/types';

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then(setModules)
      .catch(() => {});
  }, []);

  const totalProgress = modules.length > 0
    ? Math.round(modules.reduce((acc, m) => acc + (m.progress || 0), 0) / modules.length)
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">De Cero a B1</h1>
        <p className="mt-1 text-text-secondary">Tu plataforma personal de aprendizaje de inglés</p>
        <div className="mt-4 max-w-md">
          <ProgressBar value={totalProgress} size="md" label="Progreso total" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Card
            key={mod.id}
            title={mod.title}
            subtitle={mod.subtitle ? `Nivel ${mod.subtitle}` : null}
            icon={mod.icon}
            href={`/modulo/${mod.number}`}
            progress={mod.progress}
          >
            {mod.duration_weeks && (
              <span className="text-xs text-text-secondary">{mod.duration_weeks}</span>
            )}
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="mt-12 text-center text-text-secondary">
          <p>Conectando con el servidor...</p>
          <p className="mt-2 text-sm">Asegúrate de que el backend esté corriendo en el puerto 3001</p>
        </div>
      )}
    </div>
  );
}
