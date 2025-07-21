import React, { useState, useEffect } from 'react';
import { usePuzzleValidation } from '../hooks/usePuzzleValidation';

/**
 * WordInput Component Props
 * 
 * This component is now purely presentational - it only handles UI concerns.
 * All validation logic has been moved to the usePuzzleValidation hook.
 * 
 * NEW: Added optional value and onChange props to support controlled input
 * behavior, enabling external components (like TileWheel) to update the input.
 */
interface Props {
  centerLetter: string;      // The mandatory center letter for word validation
  validWords: string[];      // Array of already found valid words
  onValidWord: (word: string) => void;  // Callback when a valid word is submitted
  value?: string;            // Optional external value for controlled input
  onChange?: (value: string) => void;  // Optional callback for input changes
}

/**
 * WordInput Component
 * 
 * A controlled input component for word submission in the puzzle game.
 * This component demonstrates clear separation of concerns:
 * - UI Logic: Handled here (input state, form submission, visual feedback)
 * - Validation Logic: Delegated to usePuzzleValidation hook
 * - API Interactions: Completely isolated within the hook
 * 
 * ENHANCED: Now supports both controlled and uncontrolled modes:
 * - Controlled: When value and onChange props are provided
 * - Uncontrolled: When using internal state (backward compatible)
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-first approach with touch-friendly elements
 * - Adaptive layout that works on all screen sizes
 * - Large tap targets for better mobile UX
 */
const WordInput: React.FC<Props> = ({ 
  centerLetter, 
  validWords, 
  onValidWord,
  value: externalValue,
  onChange: externalOnChange
}) => {
  /**
   * LOCAL UI STATE - Only used in uncontrolled mode
   * 
   * When external value/onChange are provided, this state is ignored
   * in favor of the controlled behavior.
   */
  const [internalInput, setInternalInput] = useState('');
  
  /**
   * INPUT VALUE MANAGEMENT
   * 
   * Determines whether to use controlled (external) or uncontrolled (internal) value.
   * This allows the component to work in both modes seamlessly.
   */
  const isControlled = externalValue !== undefined && externalOnChange !== undefined;
  const input = isControlled ? externalValue : internalInput;
  const setInput = isControlled ? externalOnChange : setInternalInput;
  
  /**
   * VALIDATION LOGIC DELEGATION
   * 
   * The usePuzzleValidation hook encapsulates ALL validation logic:
   * - API calls to dictionary service
   * - Caching of validated words
   * - Center letter validation
   * - Duplicate checking
   * - Minimum length validation
   * 
   * This component doesn't need to know HOW validation works,
   * only that it can call validateWord() and receive results.
   */
  const { 
    validateWord,    // Async function to validate a word
    isValidating,    // Loading state during validation
    errorMessage,    // Error message if validation fails
    clearError       // Function to clear error state
  } = usePuzzleValidation({
    centerLetter,
    validWords,
    onValidWord
  });

  /**
   * UI ENHANCEMENT: Auto-clear errors when user types
   * 
   * This effect improves UX by clearing error messages as soon as
   * the user starts typing a new word, giving immediate feedback
   * that they can try again.
   */
  useEffect(() => {
    if (errorMessage && input) {
      clearError();
    }
  }, [input, errorMessage, clearError]);

  /**
   * FORM SUBMISSION HANDLER
   * 
   * This handler orchestrates the validation flow:
   * 1. Prevents default form submission
   * 2. Guards against invalid states (empty input, already validating)
   * 3. Delegates validation to the hook
   * 4. Clears input regardless of validation result
   * 
   * Note: The component doesn't implement ANY validation logic itself
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Guard clauses - prevent submission in invalid states
    if (isValidating || !input.trim()) {
      return;
    }
    
    // Delegate validation to the hook - we don't care about implementation details
    await validateWord(input);
    
    // UI concern: Always clear input after submission for better UX
    setInput('');
  };

  /**
   * RENDER: Responsive UI Components
   * 
   * The render method uses Tailwind CSS for responsive design:
   * - Mobile-first approach with progressive enhancement
   * - Touch-friendly tap targets (minimum 44px height)
   * - Adaptive spacing and typography
   * - Smooth transitions and animations
   * 
   * Notice: No validation logic exists in the render method
   */
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* 
          INPUT FIELD - RESPONSIVE DESIGN
          - Full width on mobile for easy typing
          - Larger font and padding for touch screens
          - Clear visual feedback for states
          - Smooth focus transitions
          
          INTERACTIVE FEATURE: This input can be populated by:
          1. User typing directly
          2. Clicking letters in the TileWheel component
          3. Programmatically from parent components
        */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter word with "${centerLetter.toUpperCase()}"`}
          disabled={isValidating}
          autoFocus
          aria-label="Word input"
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? "word-input-error" : undefined}
          className={`
            flex-1 px-4 py-3 text-base sm:text-lg
            border-2 rounded-lg transition-all duration-200
            ${isValidating 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
              : errorMessage
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-puzzle-blue focus:ring-2 focus:ring-blue-200'
            }
            focus:outline-none
          `}
        />
        
        {/* 
          SUBMIT BUTTON - MOBILE OPTIMIZED
          - Full width on mobile for easy tapping
          - Large touch target (48px minimum height)
          - Clear visual states
          - Loading animation during validation
        */}
        <button 
          type="submit" 
          disabled={isValidating || !input.trim()}
          aria-busy={isValidating}
          className={`
            w-full sm:w-auto px-6 py-3 
            text-base sm:text-lg font-semibold
            rounded-lg transition-all duration-200
            ${isValidating || !input.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-puzzle-blue text-white hover:bg-blue-600 active:scale-95'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puzzle-blue
          `}
        >
          {isValidating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
      
      {/* 
        ERROR MESSAGE DISPLAY - RESPONSIVE STYLING
        - Clear visual hierarchy with color and spacing
        - Animated entrance for smooth UX
        - Accessible with proper ARIA attributes
        - Touch-friendly spacing
        
        The error messages themselves come from the validation hook,
        this component just displays them with responsive styling.
      */}
      {errorMessage && (
        <div 
          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in"
          role="alert"
          id="word-input-error"
        >
          <p className="text-red-800 text-sm sm:text-base flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        </div>
      )}
    </form>
  );
};

/**
 * RESPONSIVE DESIGN SUMMARY:
 * 
 * UI Concerns (handled by this component):
 * - Managing input field state (internal or external)
 * - Form submission handling
 * - Visual feedback (disabled states, loading text)
 * - Error message display
 * - Accessibility attributes
 * 
 * Validation Concerns (delegated to usePuzzleValidation hook):
 * - Dictionary API calls
 * - Word validation rules (length, center letter, duplicates)
 * - Caching validated words
 * - Network error handling
 * - Request cancellation
 * 
 * RESPONSIVE FEATURES:
 * - Mobile-first design with Tailwind CSS
 * - Touch-friendly tap targets (48px minimum)
 * - Adaptive layout (stacked on mobile, inline on desktop)
 * - Clear visual feedback for all states
 * - Smooth animations and transitions
 * 
 * ACCESSIBILITY:
 * - Proper ARIA labels and descriptions
 * - Keyboard navigation support
 * - Clear focus indicators
 * - Screen reader friendly error messages
 * 
 * This separation makes the component:
 * - Easier to test (can mock the hook)
 * - More maintainable (validation changes don't affect UI)
 * - More reusable (hook can be used elsewhere)
 * - Better organized (single responsibility principle)
 * - Fully responsive (works on all devices)
 */

export default WordInput;
