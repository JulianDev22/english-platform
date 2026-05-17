import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Module, Unit } from '@/types';

export default function ModulePage() {
  const { moduleNumber } = useParams<{ moduleNumber: string }>();
  const [mod, setMod] = useState<Module | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then(async (modules: Module[]) => {
        const found = modules.find((m) => m.number === Number(moduleNumber));
        if (found) {
          setMod(found);
          const res = await fetch(`/api/modules/${found.id}`);
          const data = await res.json();
          setUnits(data.units || []);
        }
      })
      .catch(() => {});
  }, [moduleNumber]);

  if (!mod) {
    return <div className="mt-12 text-center text-text-secondary">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
          Módulo {mod.number}
        </span>
        <h1 className="mt-1 text-2xl font-bold">{mod.title}</h1>
        {mod.subtitle && <p className="mt-1 text-text-secondary">Nivel {mod.subtitle}</p>}
        {mod.progress !== undefined && (
          <div className="mt-3 max-w-md">
            <ProgressBar value={mod.progress} label="Progreso del módulo" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {units.map((unit) => (
          <Card
            key={unit.id}
            title={`${unit.number} — ${unit.title}`}
            subtitle={unit.objective}
            href={`/modulo/${mod.number}/unidad/${unit.number}`}
            progress={unit.progress}
          >
            {unit.objective && <p className="text-xs text-text-secondary line-clamp-2">{unit.objective}</p>}
          </Card>
        ))}
      </div>

      {units.length === 0 && (
        <p className="text-text-secondary">Este módulo no tiene unidades disponibles aún.</p>
      )}
    </div>
  );
}
