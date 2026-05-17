import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Activity } from '@/types';

interface Props {
  activity: Activity;
}

interface BlankEntry {
  id: number;
  before: string;
  after: string;
  answer: string;
  userInput: string;
  checked: boolean;
}

export function FillBlanksActivity({ activity }: Props) {
  const [entries, setEntries] = useState<BlankEntry[]>(() => {
    const config = activity.config as any;
    if (!config?.blanks) return [];
    return config.blanks.map((b: any, i: number) => ({
      id: i,
      before: b.before || '',
      after: b.after || '',
      answer: b.answer || '',
      userInput: '',
      checked: false,
    }));
  });

  const [allChecked, setAllChecked] = useState(false);

  const handleInput = (id: number, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, userInput: value } : e))
    );
  };

  const handleCheck = () => {
    setEntries((prev) =>
      prev.map((e) => ({ ...e, checked: true }))
    );
    setAllChecked(true);
  };

  const score = entries.length > 0
    ? Math.round((entries.filter((e) => e.userInput.trim().toLowerCase() === e.answer.toLowerCase()).length / entries.length) * 100)
    : 0;

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 p-8">
        <h3 className="font-medium mb-2">Instrucciones</h3>
        <p className="text-text-secondary whitespace-pre-line">{activity.description}</p>
        <div className="mt-4 p-4 bg-surface-3 rounded-lg">
          <p className="text-sm text-text-secondary">
            Esta actividad de rellenar espacios se configurará próximamente con contenido del módulo correspondiente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-4">
        {entries.map((entry) => {
          const isCorrect = entry.userInput.trim().toLowerCase() === entry.answer.toLowerCase();
          return (
            <div key={entry.id} className="flex items-center gap-2 flex-wrap">
              <span className="text-text-primary">{entry.before}</span>
              <input
                type="text"
                value={entry.userInput}
                onChange={(e) => handleInput(entry.id, e.target.value)}
                disabled={entry.checked}
                className={`w-32 rounded-lg border px-3 py-1.5 text-sm bg-surface-2 text-text-primary outline-none transition-colors ${
                  entry.checked
                    ? isCorrect
                      ? 'border-success bg-success/10'
                      : 'border-error bg-error/10'
                    : 'border-border focus:border-accent'
                }`}
                placeholder="..."
              />
              <span className="text-text-primary">{entry.after}</span>
              {entry.checked && (
                <span className={`text-sm ${isCorrect ? 'text-success' : 'text-error'}`}>
                  {isCorrect ? '✓' : `✗ (${entry.answer})`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!allChecked ? (
        <div className="mt-6">
          <Button variant="primary" onClick={handleCheck}>
            Revisar respuestas
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4">
          <p className="font-medium">
            Resultado: {score}% ({entries.filter((e) => e.userInput.trim().toLowerCase() === e.answer.toLowerCase()).length} de {entries.length})
          </p>
        </div>
      )}
    </div>
  );
}
