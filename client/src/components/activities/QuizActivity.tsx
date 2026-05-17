import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Activity, QuizQuestion } from '@/types';

interface Props {
  activity: Activity;
}

export function QuizActivity({ activity }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${activity.id}`)
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => {});
  }, [activity.id]);

  const total = questions.length;
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === questions[current].correct_index;
    setAnswered(true);
    setResults((prev) => [...prev, correct]);
  };

  const handleNext = async () => {
    if (current + 1 >= total) {
      setFinished(true);
      const score = Math.round((results.filter(Boolean).length / total) * 100);
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id: activity.id, completed: true, score }),
      });
    } else {
      setCurrent((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const score = Math.round((results.filter(Boolean).length / total) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">{score >= 80 ? '🎉' : '💪'}</div>
        <h2 className="text-xl font-bold">Resultado: {score}%</h2>
        <p className="mt-2 text-text-secondary">
          {results.filter(Boolean).length} de {total} correctas
        </p>
        <div className="mt-6 flex gap-2">
          {results.map((r, i) => (
            <span
              key={i}
              className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                r ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
              }`}
            >
              {r ? '✓' : '✗'}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return <div className="text-center py-12 text-text-secondary">Cargando preguntas...</div>;
  }

  const q = questions[current];

  return (
    <div className="mx-auto max-w-2xl">
      <ProgressBar value={progress} label={`Pregunta ${current + 1} de ${total}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="mt-6"
        >
          <h3 className="text-lg font-medium mb-4">{q.question}</h3>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isCorrect = answered && idx === q.correct_index;
              const isWrong = answered && idx === selected && idx !== q.correct_index;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all cursor-pointer ${
                    isCorrect
                      ? 'border-success bg-success/10 text-success'
                      : isWrong
                      ? 'border-error bg-error/10 text-error'
                      : selected === idx
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-2 text-text-primary hover:border-text-secondary'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && q.explanation && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-text-secondary bg-surface-2 rounded-lg p-3 border border-border"
            >
              {q.explanation}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        {!answered ? (
          <Button variant="primary" onClick={handleConfirm} disabled={selected === null}>
            Confirmar
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            {current + 1 >= total ? 'Ver resultado' : 'Siguiente'}
          </Button>
        )}
      </div>
    </div>
  );
}
