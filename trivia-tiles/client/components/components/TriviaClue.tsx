import React from 'react';

/**
 * TriviaClueProps Interface
 * 
 * Defines the properties for the TriviaClue component which displays
 * progressive hints leading to the final trivia question.
 */
export type TriviaClueProps = {
  triviaClues: string[];      // Array of clue strings to display
  triviaProgress: number;     // Number of clues currently unlocked (0 to triviaClues.length)
};

/**
 * TriviaClue Component
 * 
 * Displays trivia clues that are progressively unlocked based on puzzle progress.
 * This component creates a narrative element within the word puzzle game,
 * giving players additional motivation to find more words.
 * 
 * DESIGN PHILOSOPHY:
 * - Clues build upon each other to form a complete picture
 * - Locked clues create anticipation and drive engagement
 * - Visual feedback shows clear progression
 * 
 * ACCESSIBILITY FEATURES:
 * - Semantic HTML structure with proper headings
 * - Clear visual indicators for locked/unlocked states
 * - Screen reader friendly content
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-first approach with progressive enhancement
 * - Flexible layout that adapts to screen size
 * - Touch-friendly with clear visual hierarchy
 */
export const TriviaClue = ({ triviaClues, triviaProgress }: TriviaClueProps) => {
  /**
   * PROGRESS CALCULATION
   * 
   * Ensures triviaProgress is within valid bounds to prevent rendering errors.
   * This defensive programming prevents issues if parent components pass
   * invalid progress values.
   */
  const safeProgress = Math.min(Math.max(0, triviaProgress), triviaClues.length);

  /**
   * EMPTY STATE CHECK
   * 
   * Returns null if no clues are available, keeping the UI clean
   * when trivia features aren't part of the current puzzle.
   */
  if (!triviaClues || triviaClues.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 w-full" role="region" aria-label="Trivia Clues">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
        <span>Trivia Clues</span>
        {/**
         * PROGRESS INDICATOR
         * 
         * Shows numerical progress (e.g., "2/4") to give players
         * a clear sense of their advancement through the clues.
         * Mobile-friendly with appropriate text sizing.
         */}
        <span className="text-sm sm:text-base font-normal text-gray-600">
          {safeProgress}/{triviaClues.length}
        </span>
      </h3>
      
      {/**
       * CLUE LIST - RESPONSIVE LAYOUT
       * 
       * Renders each clue with appropriate styling based on unlock status.
       * The progressive reveal creates a sense of discovery and achievement.
       * 
       * Mobile optimizations:
       * - Increased padding for easier reading
       * - Clear visual separation between items
       * - Touch-friendly spacing
       */}
      <ul className="space-y-2 sm:space-y-3" role="list">
        {triviaClues.map((clue, index) => {
          const isUnlocked = index < safeProgress;
          
          return (
            <li 
              key={index} 
              className={`
                p-3 sm:p-4 rounded-lg transition-all duration-300
                ${isUnlocked 
                  ? 'bg-green-50 border border-green-200 animate-fade-in' 
                  : 'bg-gray-50 border border-gray-200 opacity-60'
                }
              `}
              role="listitem"
            >
              {/**
               * CLUE CONTENT - MOBILE OPTIMIZED
               * 
               * Unlocked clues show the actual hint text.
               * Locked clues show a placeholder with visual indicator.
               * 
               * The lock emoji (🔒) provides immediate visual feedback
               * about clue status without requiring color perception.
               * 
               * Responsive features:
               * - Flexible layout with proper text wrapping
               * - Appropriate font sizes for readability
               * - Clear visual hierarchy
               */}
              {isUnlocked ? (
                <div className="flex items-start">
                  <span className="text-green-600 font-semibold mr-2 text-sm sm:text-base">
                    {index + 1}.
                  </span>
                  <span className="text-gray-800 text-sm sm:text-base leading-relaxed flex-1">
                    {clue}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <span className="text-lg sm:text-xl mr-2" aria-label="Locked">
                    🔒
                  </span>
                  <span className="text-sm sm:text-base italic">
                    Clue {index + 1} - Find more words to unlock!
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      {/**
       * COMPLETION HINT - RESPONSIVE STYLING
       * 
       * When all clues are unlocked, provide guidance about the next step.
       * This helps players understand the game flow and creates anticipation
       * for the final trivia challenge.
       * 
       * Mobile-friendly with appropriate spacing and text size.
       */}
      {safeProgress === triviaClues.length && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm sm:text-base text-center">
            <em>All clues unlocked! Keep finding words to reveal the final trivia question.</em>
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * RESPONSIVE DESIGN NOTES:
 * 
 * 1. MOBILE-FIRST APPROACH:
 *    - Base styles optimized for small screens
 *    - Progressive enhancement with sm: breakpoint
 *    - Touch-friendly tap targets and spacing
 * 
 * 2. VISUAL HIERARCHY:
 *    - Clear distinction between locked/unlocked states
 *    - Consistent spacing and padding
 *    - Readable typography at all sizes
 * 
 * 3. ACCESSIBILITY:
 *    - Proper semantic HTML structure
 *    - ARIA labels for screen readers
 *    - Color-independent status indicators (lock emoji)
 * 
 * 4. ANIMATIONS:
 *    - Smooth fade-in for newly unlocked clues
 *    - Transitions for hover/focus states
 *    - Performance-optimized animations
 * 
 * 5. FLEXIBILITY:
 *    - Component adapts to container width
 *    - Text wraps appropriately on small screens
 *    - Maintains readability at all sizes
 */
