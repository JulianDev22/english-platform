import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FlashcardsActivity } from '@/components/activities/FlashcardsActivity';
import { QuizActivity } from '@/components/activities/QuizActivity';
import { FillBlanksActivity } from '@/components/activities/FillBlanksActivity';
import type { Activity } from '@/types';

const activityComponents: Record<string, React.ComponentType<any>> = {
  flashcard: FlashcardsActivity,
  quiz: QuizActivity,
  'fill-blanks': FillBlanksActivity,
};

export default function ActivityPage() {
  const { moduleNumber, unitNumber, activityId } = useParams<{
    moduleNumber: string;
    unitNumber: string;
    activityId: string;
  }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!activityId) return;
    fetch(`/api/activities/${activityId}`)
      .then((r) => r.json())
      .then(setActivity)
      .catch(() => {});
  }, [activityId]);

  if (!activity) {
    return <div className="mt-12 text-center text-text-secondary">Cargando actividad...</div>;
  }

  const ActivityComponent = activityComponents[activity.activity_type];

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/modulo/${moduleNumber}/unidad/${unitNumber}`}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Volver a la unidad
        </Link>
        <div className="mt-2">
          <span className="text-xs font-mono text-text-secondary">{activity.code}</span>
          <h1 className="text-xl font-bold mt-0.5">{activity.title}</h1>
        </div>
      </div>

      {ActivityComponent ? (
        <ActivityComponent activity={activity} />
      ) : (
        <div className="rounded-xl border border-border bg-surface-2 p-8 text-center">
          <p className="text-text-secondary">
            Actividad de tipo <strong>{activity.activity_type}</strong> en desarrollo.
          </p>
          {activity.description && (
            <div className="mt-4 text-left text-sm text-text-secondary whitespace-pre-line">
              {activity.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
