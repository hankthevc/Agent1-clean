import React, { useState, useMemo, useEffect } from 'react';
import WordInput from './components/WordInput';
import { TileWheel } from './components/TileWheel';
import { TriviaClue } from './components/TriviaClue';
import { FinalTrivia } from './components/FinalTrivia';
import { Paywall } from './components/Paywall';
import { usePuzzleData, usePremiumContent } from './hooks';
import { initGA, trackEvent } from './analytics';
import { AdBanner } from './components/AdBanner';

const TRIVIA_UNLOCK_THRESHOLDS = [0.25, 0.40, 0.60, 0.80];
const FINAL_TRIVIA_THRESHOLD = 0.90;

const AD_SENSE_PUBLISHER_ID = process.env.REACT_APP_AD_SENSE_PUBLISHER_ID || 'ca-pub-YOUR_PUBLISHER_ID_HERE';
const AD_SENSE_TOP_BANNER_SLOT_ID = process.env.REACT_APP_AD_SENSE_TOP_BANNER_SLOT_ID || 'YOUR_TOP_BANNER_SLOT_ID';
const AD_SENSE_IN_CONTENT_SLOT_ID = process.env.REACT_APP_AD_SENSE_IN_CONTENT_SLOT_ID || 'YOUR_IN_CONTENT_SLOT_ID';

export function AppContent() {
  useEffect(() => {
    initGA();
  }, []);

  const { puzzleData, isLoading, error } = usePuzzleData();
  const { hasAccess, freePuzzlesRemaining, purchasePuzzles, consumeCredit, isRedirecting } = usePremiumContent();

  useEffect(() => {
    if (puzzleData) {
      trackEvent('Puzzle', 'Load Success', puzzleData.pangram);
    }
  }, [puzzleData]);

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [showFinalTrivia, setShowFinalTrivia] = useState(false);
  const [triviaCompleted, setTriviaCompleted] = useState(false);

  const progress = useMemo(() => {
    if (!puzzleData || puzzleData.validWords.length === 0) return 0;
    return foundWords.length / puzzleData.validWords.length;
  }, [foundWords.length, puzzleData]);

  const unlockedCluesCount = useMemo(() => {
    if (!puzzleData) return 0;
    const count = TRIVIA_UNLOCK_THRESHOLDS.filter(threshold => progress >= threshold).length;
    if (count > (TRIVIA_UNLOCK_THRESHOLDS.filter(t => (foundWords.length - 1) / puzzleData.validWords.length >= t).length || 0)) {
        trackEvent('Trivia', 'Clue Unlocked', `Clue ${count}`, count);
    }
    return count;
  }, [progress, foundWords.length, puzzleData]);

  useEffect(() => {
    if (progress >= FINAL_TRIVIA_THRESHOLD && !showFinalTrivia && !triviaCompleted) {
      setShowFinalTrivia(true);
      trackEvent('Trivia', 'Final Trivia Shown');
    }
  }, [progress, showFinalTrivia, triviaCompleted]);

  const handleValidWord = (word: string) => {
    setFoundWords((prevWords) => [...prevWords, word]);
    const score = word.length;
    trackEvent('Puzzle', 'Valid Word', word, score);
  };

  const handleLetterClick = (letter: string) => {
    setCurrentInput(prev => prev + letter.toLowerCase());
  };

  const handleTriviaComplete = () => {
    setTriviaCompleted(true);
    setShowFinalTrivia(false);
    trackEvent('Trivia', 'Final Trivia Success');
    consumeCredit(); // Consume a puzzle credit upon completion
  };

  if (!hasAccess) {
    return <Paywall onPurchase={purchasePuzzles} isRedirecting={isRedirecting} freePuzzlesPlayed={3 - freePuzzlesRemaining} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trivia Tiles</h1>
          <div className="text-lg text-gray-600 animate-pulse-subtle">Loading puzzle...</div>
        </div>
      </div>
    );
  }

  if (error && !puzzleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trivia Tiles</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">Failed to load puzzle</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!puzzleData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Trivia Tiles
        </h1>
        
        {/* --- Top Ad Banner --- */}
        <AdBanner 
          publisherId={AD_SENSE_PUBLISHER_ID} 
          slotId={AD_SENSE_TOP_BANNER_SLOT_ID} 
        />
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-yellow-800 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {triviaCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center animate-fade-in">
            <p className="text-green-800 text-lg sm:text-xl font-semibold">
              🎉 Congratulations! You solved the trivia puzzle! 🎉
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <p className="text-gray-600 text-sm">Words Found</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{foundWords.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <p className="text-gray-600 text-sm">Progress</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{Math.round(progress * 100)}%</p>
          </div>
          
          {progress < FINAL_TRIVIA_THRESHOLD && (
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center xs:col-span-2 lg:col-span-1">
              <p className="text-gray-600 text-sm">Final Trivia Unlocks</p>
              <p className="text-2xl sm:text-3xl font-bold text-puzzle-blue">
                {Math.round(FINAL_TRIVIA_THRESHOLD * 100)}%
              </p>
            </div>
          )}
        </div>

        {puzzleData.triviaClues && 
         puzzleData.triviaClues.length > 0 && 
         unlockedCluesCount > 0 && 
         !triviaCompleted && (
          <div className="mb-6 sm:mb-8">
            <TriviaClue 
              triviaClues={puzzleData.triviaClues}
              triviaProgress={unlockedCluesCount}
            />
          </div>
        )}

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="transform scale-90 sm:scale-100">
            <TileWheel
              center={puzzleData.center}
              outer={puzzleData.outer}
              onLetterClick={handleLetterClick}
            />
          </div>
        </div>

        {/* --- In-Content Ad Banner --- */}
        <div className="my-8">
          <AdBanner 
            publisherId={AD_SENSE_PUBLISHER_ID} 
            slotId={AD_SENSE_IN_CONTENT_SLOT_ID} 
            adLayout="in-article"
            adFormat="fluid"
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <WordInput
            centerLetter={puzzleData.center.toLowerCase()}
            validWords={foundWords}
            onValidWord={handleValidWord}
            value={currentInput}
            onChange={setCurrentInput}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Found Words ({foundWords.length})
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {foundWords.map((word) => (
              <div
                key={word}
                className={`
                  px-3 py-2 rounded-full text-center text-sm sm:text-base
                  transition-all duration-300 animate-fade-in
                  ${word === puzzleData.pangram 
                    ? 'bg-puzzle-gold text-gray-800 font-semibold' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                {word}
                {word === puzzleData.pangram && (
                  <span className="ml-1 text-lg">★</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {showFinalTrivia && puzzleData.finalTrivia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <FinalTrivia
                question={puzzleData.finalTrivia.question}
                correctAnswer={puzzleData.finalTrivia.answer}
                onCorrect={handleTriviaComplete}
                triviaClues={puzzleData.triviaClues}
              />
              <button 
                className="mt-6 w-full sm:w-auto px-6 py-3 bg-puzzle-green text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                onClick={() => setShowFinalTrivia(false)}
                aria-label="Close trivia question"
              >
                Continue Playing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 