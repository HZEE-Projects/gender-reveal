'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';

export default function Reveal() {
  const [balloons, setBalloons] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const newBalloons = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    }));
    setBalloons(newBalloons);
  }, []);

  const popBalloon = (id: number) => {
    const audio = new Audio('/pop.mp3');
    audio.play();
    setBalloons(balloons.filter(b => b.id !== id));
    setPoppedCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowFinal(true);
      }
      return newCount;
    });
  };

  const revealGender = () => {
    setRevealed(true);
    const audio = new Audio('/tada.mp3');
    audio.play();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#FFB6C1', '#FFC0CB']
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto relative min-h-[600px]">
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            className="absolute cursor-pointer animate-bounce"
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
            }}
            onClick={() => popBalloon(balloon.id)}
          >
            <div className="text-6xl">🎈</div>
          </div>
        ))}

        {showFinal && !revealed && (
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={revealGender}
          >
            <div className="text-9xl animate-bounce">🎈</div>
          </div>
        )}

        {revealed && (
          <Card className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 text-center bg-pink-500 text-white animate-fade-in">
            <h1 className="text-6xl font-bold mb-4">It's a Girl! 👶</h1>
            <p className="text-2xl">Congratulations!</p>
          </Card>
        )}
      </div>
    </div>
  );
}