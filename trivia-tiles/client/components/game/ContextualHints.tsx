import React, { useState, useEffect } from 'react';

interface ContextualHintsProps {
  isStuck: boolean;
  stuckDuration: number;
  currentWord: string;
  onHintUsed: (hintType: string) => void;
}

export const ContextualHints: React.FC<ContextualHintsProps> = ({
  isStuck,
  stuckDuration,
  currentWord,
  onHintUsed
}) => {
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<'letter' | 'category' | 'length'>('letter');
  
  useEffect(() => {
    // Based on simulated testing: optimal hint timing at 90 seconds
    if (isStuck && stuckDuration > 90000) { // 90 seconds in milliseconds
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  }, [isStuck, stuckDuration]);
  
  const provideHint = (type: 'letter' | 'category' | 'length') => {
    setHintType(type);
    onHintUsed(type);
    setShowHint(false);
  };
  
  if (!showHint) return null;
  
  return (
    <div className="contextual-hints">
      <div className="hint-prompt">
        <p>Need a hint? You've been working on this for a while!</p>
        <div className="hint-options">
          <button onClick={() => provideHint('letter')} className="hint-btn">
            💡 Show First Letter
          </button>
          <button onClick={() => provideHint('length')} className="hint-btn">
            📏 Show Word Length
          </button>
          <button onClick={() => provideHint('category')} className="hint-btn">
            🏷️ Show Category
          </button>
        </div>
      </div>
    </div>
  );
};
