import React, { useState, useEffect } from 'react';

interface AdaptiveDifficultyProps {
  userPerformance: {
    averageTime: number;
    successRate: number;
    hintUsage: number;
  };
  onDifficultyChange: (newDifficulty: number) => void;
}

export const AdaptiveDifficulty: React.FC<AdaptiveDifficultyProps> = ({
  userPerformance,
  onDifficultyChange
}) => {
  const [currentDifficulty, setCurrentDifficulty] = useState(0.5); // Start at medium
  
  useEffect(() => {
    // Adaptive algorithm based on simulated user testing
    let newDifficulty = currentDifficulty;
    
    // If user is performing well (based on IQ 110 benchmarks)
    if (userPerformance.successRate > 0.8 && userPerformance.averageTime < 60) {
      newDifficulty = Math.min(1.0, currentDifficulty + 0.1);
    }
    // If user is struggling (based on simulation data)
    else if (userPerformance.successRate < 0.4 || userPerformance.hintUsage > 0.6) {
      newDifficulty = Math.max(0.2, currentDifficulty - 0.1);
    }
    
    if (newDifficulty !== currentDifficulty) {
      setCurrentDifficulty(newDifficulty);
      onDifficultyChange(newDifficulty);
    }
  }, [userPerformance, currentDifficulty, onDifficultyChange]);
  
  return (
    <div className="adaptive-difficulty-indicator">
      <div className="difficulty-bar">
        <div 
          className="difficulty-level"
          style={{ width: `${currentDifficulty * 100}%` }}
        />
      </div>
      <span className="difficulty-label">
        {currentDifficulty < 0.3 ? 'Easy' : 
         currentDifficulty < 0.7 ? 'Medium' : 'Hard'}
      </span>
    </div>
  );
};
