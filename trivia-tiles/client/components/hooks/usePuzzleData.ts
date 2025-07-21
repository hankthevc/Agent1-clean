import { useState, useEffect, useCallback } from 'react';

export interface PuzzleData {
  center: string;
  outer: string[];
  validWords: string[];
  pangram: string;
  triviaClues: string[];
  finalTrivia?: {
    question: string;
    answer: string;
  };
}

export interface UsePuzzleDataReturn {
  puzzleData: PuzzleData | null;
  isLoading: boolean;
  error: string | null;
  refetchPuzzle: () => Promise<void>;
}

// For development, we can use a fallback to local data
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const usePuzzleData = (): UsePuzzleDataReturn => {
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPuzzle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/puzzle`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPuzzleData(data);
    } catch (err) {
      console.error('Error fetching puzzle:', err);
      
      // In development, fallback to local data if API fails
      if (process.env.NODE_ENV === 'development') {
        try {
          // Dynamic import for fallback data
          const fallbackData = await import('../data/samplePuzzle.json');
          setPuzzleData(fallbackData.default as PuzzleData);
          setError('Using local puzzle data (API unavailable)');
        } catch (importErr) {
          setError('Failed to load puzzle data');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  return {
    puzzleData,
    isLoading,
    error,
    refetchPuzzle: fetchPuzzle
  };
}; 