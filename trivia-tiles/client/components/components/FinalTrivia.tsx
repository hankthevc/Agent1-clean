import React, { useState } from 'react';

/**
 * FinalTriviaProps Interface
 * 
 * Defines the properties for the FinalTrivia component which presents
 * the culminating trivia question after players have made sufficient
 * progress in the word puzzle.
 */
export interface FinalTriviaProps {
  question: string;           // The trivia question to display
  correctAnswer: string;      // The expected correct answer
  onCorrect: () => void;      // Callback when answer is correct
  triviaClues?: string[];     // Optional: Previous clues for hint display
}

/**
 * FinalTrivia Component
 * 
 * The climactic moment of the puzzle game where players apply the clues
 * they've collected to answer a final trivia question. This component
 * creates a sense of achievement and narrative closure.
 * 
 * USER EXPERIENCE FEATURES:
 * - Multiple attempts allowed with encouraging feedback
 * - Optional hints system revealing collected clues
 * - Case-insensitive answer matching for flexibility
 * - Visual feedback for correct/incorrect attempts
 * - Celebration animation on success
 * 
 * ACCESSIBILITY FEATURES:
 * - Proper focus management
 * - Screen reader announcements for feedback
 * - Keyboard navigation support
 * - Clear visual indicators
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-first approach with touch-friendly elements
 * - Adaptive layout for all screen sizes
 * - Scroll support for long content
 * - Large tap targets for mobile users
 */
export const FinalTrivia: React.FC<FinalTriviaProps> = ({ 
  question, 
  correctAnswer, 
  onCorrect,
  triviaClues = []
}) => {
  /**
   * COMPONENT STATE
   * 
   * Manages the interactive elements of the trivia challenge:
   * - userAnswer: Current input from the player
   * - attempts: Number of tries (for analytics or difficulty adjustment)
   * - showHint: Whether to display collected clues as hints
   * - isCorrect: Success state for celebration UI
   * - error: Feedback for incorrect attempts
   */
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState('');

  /**
   * ANSWER VALIDATION HANDLER
   * 
   * Processes the player's answer submission:
   * 1. Prevents empty submissions
   * 2. Normalizes answer for case-insensitive comparison
   * 3. Provides appropriate feedback
   * 4. Triggers success callback on correct answer
   * 
   * The forgiving validation (trim, lowercase) ensures players
   * aren't penalized for minor formatting differences.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedAnswer = userAnswer.trim();
    if (!trimmedAnswer) {
      setError('Please enter an answer');
      return;
    }

    setAttempts(prev => prev + 1);

    if (trimmedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setError('');
      // Delay callback to allow celebration animation
      setTimeout(() => {
        onCorrect();
      }, 1500);
    } else {
      setError('Not quite right. Try again!');
      // Auto-clear error after delay for better UX
      setTimeout(() => setError(''), 3000);
    }
  };

  /**
   * HINT TOGGLE HANDLER
   * 
   * Reveals collected trivia clues to help players who are stuck.
   * This creates a connection between the main puzzle gameplay
   * and the final challenge, rewarding attentive players.
   */
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  /**
   * RENDER SUCCESS STATE
   * 
   * Special UI for when the player answers correctly.
   * Features celebratory styling and positive feedback
   * to create a memorable moment of achievement.
   */
  if (isCorrect) {
    return (
      <div className="text-center animate-slide-up">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
          🎉 Correct! 🎉
        </h2>
        <p className="text-lg sm:text-xl text-gray-700">
          Excellent work! You've solved the trivia puzzle!
        </p>
        <div className="mt-6 text-4xl sm:text-5xl animate-bounce">
          🏆
        </div>
      </div>
    );
  }

  /**
   * MAIN TRIVIA UI - RESPONSIVE LAYOUT
   * 
   * The primary interface for answering the trivia question.
   * Organized into clear sections with responsive design
   * for optimal experience on all devices.
   */
  return (
    <div className="space-y-4 sm:space-y-6">
      {/**
       * HEADER SECTION
       * 
       * Sets the context and importance of this moment in the game.
       * The header creates anticipation and clearly indicates
       * this is the final challenge.
       */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Final Trivia Challenge
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Use the clues you've discovered to answer this question:
        </p>
      </div>

      {/**
       * QUESTION DISPLAY - MOBILE OPTIMIZED
       * 
       * The trivia question is prominently displayed with
       * appropriate styling to draw focus and ensure readability
       * on all screen sizes.
       */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6">
        <p className="text-base sm:text-lg text-gray-800 font-medium text-center">
          {question}
        </p>
      </div>

      {/**
       * ANSWER FORM - RESPONSIVE DESIGN
       * 
       * Input form optimized for mobile with:
       * - Full-width layout on small screens
       * - Large touch targets
       * - Clear visual feedback
       * - Smooth transitions
       */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label 
            htmlFor="trivia-answer" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Answer:
          </label>
          <input
            id="trivia-answer"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            autoFocus
            className={`
              w-full px-4 py-3 text-base
              border-2 rounded-lg transition-all duration-200
              ${error 
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-300 focus:border-puzzle-blue focus:ring-2 focus:ring-blue-200'
              }
              focus:outline-none
            `}
            aria-invalid={!!error}
            aria-describedby={error ? "answer-error" : undefined}
          />
        </div>

        {/**
         * ERROR MESSAGE - MOBILE FRIENDLY
         * 
         * Displays feedback for incorrect attempts with:
         * - Clear visual hierarchy
         * - Animated entrance
         * - Auto-dismissal for clean UX
         * - Accessible markup
         */}
        {error && (
          <div 
            id="answer-error" 
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in"
          >
            <p className="text-red-800 text-sm sm:text-base flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/**
         * ACTION BUTTONS - RESPONSIVE LAYOUT
         * 
         * Submit and hint buttons with:
         * - Stack on mobile, side-by-side on larger screens
         * - Large tap targets (48px minimum)
         * - Clear visual states
         * - Smooth hover/active transitions
         */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-puzzle-blue text-white font-semibold 
                       rounded-lg hover:bg-blue-600 active:scale-95 
                       transition-all duration-200 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-puzzle-blue"
          >
            Submit Answer
          </button>

          {/**
           * HINT BUTTON
           * 
           * Optional hint system that reveals collected clues.
           * Only shown if trivia clues were provided to the component.
           * This rewards players who paid attention during the main game.
           */}
          {triviaClues.length > 0 && (
            <button 
              type="button"
              onClick={toggleHint}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 
                         font-semibold rounded-lg hover:bg-gray-300 
                         active:scale-95 transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-gray-400"
              aria-expanded={showHint}
              aria-controls="trivia-hints"
            >
              {showHint ? 'Hide' : 'Show'} Hints
            </button>
          )}
        </div>
      </form>

      {/**
       * HINT SECTION - RESPONSIVE DISPLAY
       * 
       * Collapsible section showing previously collected clues.
       * This creates a narrative connection between the word puzzle
       * and trivia challenge phases of the game.
       * 
       * Mobile optimizations:
       * - Full-width display
       * - Readable font sizes
       * - Clear visual separation
       */}
      {showHint && triviaClues.length > 0 && (
        <div 
          id="trivia-hints"
          className="bg-yellow-50 border border-yellow-200 rounded-lg 
                     p-4 sm:p-5 animate-fade-in"
          role="region"
          aria-label="Trivia hints"
        >
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
            Remember these clues:
          </h3>
          <ul className="space-y-2">
            {triviaClues.map((clue, index) => (
              <li 
                key={index}
                className="flex items-start text-sm sm:text-base"
              >
                <span className="text-yellow-700 font-semibold mr-2">•</span>
                <span className="text-gray-700">{clue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/**
       * ATTEMPT COUNTER - MOBILE FRIENDLY
       * 
       * Shows number of attempts, which could be used for:
       * - Difficulty adjustment in future puzzles
       * - Achievement/scoring systems
       * - Player analytics
       * 
       * Subtle display to avoid pressure while maintaining transparency.
       */}
      {attempts > 0 && (
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Attempts: {attempts}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * RESPONSIVE DESIGN SUMMARY:
 * 
 * 1. MOBILE-FIRST APPROACH:
 *    - Base styles work perfectly on mobile
 *    - Progressive enhancement for larger screens
 *    - Touch-optimized interactions
 * 
 * 2. LAYOUT ADAPTATIONS:
 *    - Buttons stack vertically on mobile
 *    - Form fields span full width
 *    - Appropriate spacing for touch
 * 
 * 3. TYPOGRAPHY:
 *    - Responsive text sizes with sm: variants
 *    - Readable line heights
 *    - Clear visual hierarchy
 * 
 * 4. INTERACTION DESIGN:
 *    - Large tap targets (minimum 48px)
 *    - Clear hover/active states
 *    - Smooth transitions
 * 
 * 5. ACCESSIBILITY:
 *    - Semantic HTML structure
 *    - ARIA attributes for screen readers
 *    - Keyboard navigation support
 *    - Focus management
 * 
 * 6. PERFORMANCE:
 *    - Minimal re-renders
 *    - Efficient animations
 *    - Optimized for mobile devices
 * 
 * USAGE EXAMPLE:
 * ```
 * <FinalTrivia
 *   question="What connects all these clues?"
 *   correctAnswer="puzzle"
 *   onCorrect={handleTriviaComplete}
 *   triviaClues={["Clue 1", "Clue 2", "Clue 3"]}
 * />
 * ```
 */
