import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Activity, Flashcard } from '@/types';

interface Props {
  activity: Activity;
}

export function FlashcardsActivity({ activity }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch(`/api/flashcards/${activity.id}`)
      .then((r) => r.json())
      .then(setCards)
      .catch(() => {});
  }, [activity.id]);

  const total = cards.length;
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  const handleRate = async () => {
    if (current + 1 >= total) {
      setCompleted(true);
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id: activity.id, completed: true, score: 100 }),
      });
    } else {
      setCurrent((i) => i + 1);
      setFlipped(false);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold">¡Completaste todas las tarjetas!</h2>
        <p className="mt-2 text-text-secondary">Sigue practicando para mantenerlas en tu memoria.</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return <div className="text-center py-12 text-text-secondary">No hay flashcards disponibles.</div>;
  }

  const card = cards[current];

  return (
    <div className="mx-auto max-w-lg">
      <ProgressBar value={progress} label={`Tarjeta ${current + 1} de ${total}`} />

      <div className="mt-6 perspective-1000" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="cursor-pointer"
            onClick={() => setFlipped(!flipped)}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="relative w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`rounded-2xl border border-border bg-surface-2 p-8 min-h-[250px] flex flex-col items-center justify-center text-center ${
                  flipped ? 'hidden' : ''
                }`}
              >
                <span className="text-sm text-text-secondary mb-2">FRENTE</span>
                <p className="text-xl font-medium">{card.front}</p>
                {card.hints && (
                  <p className="mt-4 text-sm text-text-secondary italic">💡 {card.hints}</p>
                )}
                <p className="mt-6 text-xs text-text-secondary">Toca para ver la respuesta</p>
              </div>

              <div
                className={`rounded-2xl border border-accent/30 bg-accent/5 p-8 min-h-[250px] flex flex-col items-center justify-center text-center ${
                  !flipped ? 'hidden' : ''
                }`}
              >
                <span className="text-sm text-text-secondary mb-2">RESPUESTA</span>
                <p className="text-xl font-medium text-accent">{card.back}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 flex justify-center gap-3"
          >
            <Button variant="ghost" onClick={handleRate}>
              Again
            </Button>
            <Button variant="secondary" onClick={handleRate}>
              Hard
            </Button>
            <Button variant="primary" onClick={handleRate}>
              Good
            </Button>
            <Button variant="primary" onClick={handleRate}>
              Easy
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!flipped && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => setFlipped(true)}>
            Mostrar respuesta
          </Button>
        </div>
      )}
    </div>
  );
}
