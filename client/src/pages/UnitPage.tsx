import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Activity, Topic } from '@/types';

const activityIcons: Record<string, string> = {
  flashcard: '🃏',
  quiz: '📝',
  'fill-blanks': '✏️',
  matching: '🔗',
  writing: '📄',
  dictation: '🎧',
  roleplay: '🎭',
  audio: '🎤',
};

export default function UnitPage() {
  const { moduleNumber, unitNumber } = useParams<{ moduleNumber: string; unitNumber: string }>();
  const [unit, setUnit] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then(async (modules: any[]) => {
        const mod = modules.find((m: any) => m.number === Number(moduleNumber));
        if (!mod) return;
        const res = await fetch(`/api/modules/${mod.id}`);
        const data = await res.json();
        const found = (data.units || []).find((u: any) => u.number === unitNumber);
        if (found) {
          setUnit(found);
          const unitRes = await fetch(`/api/units/${found.id}`);
          const unitData = await unitRes.json();
          setTopics(unitData.topics || []);
          setActivities(unitData.activities || []);
        }
      })
      .catch(() => {});
  }, [moduleNumber, unitNumber]);

  if (!unit) {
    return <div className="mt-12 text-center text-text-secondary">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          to={`/modulo/${moduleNumber}`}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Volver al módulo
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{unit.number} — {unit.title}</h1>
        {unit.objective && <p className="mt-1 text-text-secondary">{unit.objective}</p>}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Subtemas</h2>
        <div className="space-y-2">
          {topics.map((topic) => (
            <details key={topic.id} className="group rounded-lg border border-border bg-surface-2">
              <summary className="cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-3 transition-colors list-none flex items-center justify-between">
                <span>{topic.title}</span>
                <span className="text-xs text-text-secondary">▼</span>
              </summary>
              {topic.content && (
                <div className="border-t border-border px-4 py-3 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {topic.content}
                </div>
              )}
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Actividades</h2>
        <div className="space-y-3">
          {activities.map((act) => (
            <Link
              key={act.id}
              to={`/modulo/${moduleNumber}/unidad/${unitNumber}/actividad/${act.id}`}
              className="block"
            >
              <Card
                title={`${act.code} — ${act.title}`}
                progress={act.completed ? 100 : undefined}
              >
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg">{activityIcons[act.activity_type] || '📌'}</span>
                  <Badge variant={act.completed ? 'success' : 'info'}>
                    {act.activity_type}
                  </Badge>
                  {act.score !== null && act.score !== undefined && (
                    <span className="text-xs text-text-secondary">{act.score}%</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
