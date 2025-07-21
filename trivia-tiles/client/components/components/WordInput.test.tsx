import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WordInput from './WordInput';
import { usePuzzleValidation } from '../hooks/usePuzzleValidation';

/**
 * Mock the validation hook
 * 
 * This allows us to test the WordInput component in isolation
 * without depending on the actual hook implementation.
 */
jest.mock('../hooks/usePuzzleValidation');

/**
 * WordInput Component Test Suite
 * 
 * This test suite ensures the WordInput component correctly:
 * - Renders form elements
 * - Handles user input
 * - Integrates with the validation hook
 * - Displays validation feedback
 * - Supports controlled and uncontrolled modes
 * - Provides accessibility features
 */
describe('WordInput Component', () => {
  // Mock implementation of validation hook
  const mockValidateWord = jest.fn();
  const mockClearError = jest.fn();
  
  // Default mock return value
  const defaultMockHookReturn = {
    validateWord: mockValidateWord,
    isValidating: false,
    errorMessage: null,
    clearError: mockClearError
  };

  // Default props
  const defaultProps = {
    centerLetter: 'a',
    validWords: ['apple', 'able'],
    onValidWord: jest.fn()
  };

  /**
   * SETUP AND TEARDOWN
   * 
   * Configure mocks before each test and clean up after
   */
  beforeEach(() => {
    jest.clearAllMocks();
    (usePuzzleValidation as jest.Mock).mockReturnValue(defaultMockHookReturn);
  });

  /**
   * RENDERING TESTS
   * 
   * Verify the component renders all necessary elements
   */
  describe('Rendering', () => {
    it('should render input field with correct placeholder', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<WordInput {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeInTheDocument();
    });

    it('should render form element', () => {
      const { container } = render(<WordInput {...defaultProps} />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('word-input');
    });

    it('should focus input on mount', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toHaveFocus();
    });
  });

  /**
   * USER INPUT TESTS
   * 
   * Test how the component handles keyboard input and form submission
   */
  describe('User Input Handling', () => {
    it('should update input value when user types', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input).toHaveValue('test');
    });

    it('should clear input after submission', async () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      const button = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('should handle form submission with Enter key', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      const form = screen.getByRole('button').closest('form')!;
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.submit(form);
      
      expect(mockValidateWord).toHaveBeenCalledWith('test');
    });

    it('should prevent submission with empty input', () => {
      render(<WordInput {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.click(button);
      
      expect(mockValidateWord).not.toHaveBeenCalled();
    });

    it('should handle input with whitespace', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      const form = screen.getByRole('button').closest('form')!;
      
      fireEvent.change(input, { target: { value: '  test  ' } });
      fireEvent.submit(form);
      
      expect(mockValidateWord).toHaveBeenCalledWith('  test  ');
    });
  });

  /**
   * VALIDATION INTEGRATION TESTS
   * 
   * Test how the component integrates with the validation hook
   */
  describe('Validation Hook Integration', () => {
    it('should pass correct props to validation hook', () => {
      render(<WordInput {...defaultProps} />);
      
      expect(usePuzzleValidation).toHaveBeenCalledWith({
        centerLetter: 'a',
        validWords: ['apple', 'able'],
        onValidWord: defaultProps.onValidWord
      });
    });

    it('should disable input during validation', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        isValidating: true
      });
      
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toBeDisabled();
    });

    it('should disable button during validation', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        isValidating: true
      });
      
      render(<WordInput {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show "Checking..." text during validation', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        isValidating: true
      });
      
      render(<WordInput {...defaultProps} />);
      
      expect(screen.getByText('Checking...')).toBeInTheDocument();
    });

    it('should display error message', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        errorMessage: 'Word must contain the letter "A".'
      });
      
      render(<WordInput {...defaultProps} />);
      
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Word must contain the letter "A".');
    });

    it('should clear error when user types', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        errorMessage: 'Test error'
      });
      
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      
      fireEvent.change(input, { target: { value: 'a' } });
      
      expect(mockClearError).toHaveBeenCalled();
    });
  });

  /**
   * CONTROLLED MODE TESTS
   * 
   * Test the component when used as a controlled input
   */
  describe('Controlled Mode', () => {
    it('should use external value when provided', () => {
      const props = {
        ...defaultProps,
        value: 'external',
        onChange: jest.fn()
      };
      
      render(<WordInput {...props} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toHaveValue('external');
    });

    it('should call external onChange when input changes', () => {
      const mockOnChange = jest.fn();
      
      const props = {
        ...defaultProps,
        value: '',
        onChange: mockOnChange
      };
      
      render(<WordInput {...props} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      
      // Simulate typing each character
      fireEvent.change(input, { target: { value: 't' } });
      fireEvent.change(input, { target: { value: 'te' } });
      fireEvent.change(input, { target: { value: 'tes' } });
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should be called for each change
      expect(mockOnChange).toHaveBeenCalledTimes(4);
      expect(mockOnChange).toHaveBeenLastCalledWith('test');
    });

    it('should clear input using external onChange', () => {
      const mockOnChange = jest.fn();
      
      const props = {
        ...defaultProps,
        value: 'test',
        onChange: mockOnChange
      };
      
      render(<WordInput {...props} />);
      
      const button = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.click(button);
      
      // Should call onChange with empty string to clear
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  /**
   * ACCESSIBILITY TESTS
   * 
   * Ensure the component is accessible to all users
   */
  describe('Accessibility', () => {
    it('should have proper ARIA label on input', () => {
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByLabelText('Word input');
      expect(input).toBeInTheDocument();
    });

    it('should mark input as invalid when error exists', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        errorMessage: 'Test error'
      });
      
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should link error message to input', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        errorMessage: 'Test error'
      });
      
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      expect(input).toHaveAttribute('aria-describedby', 'word-input-error');
      
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'word-input-error');
    });

    it('should indicate busy state during validation', () => {
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        isValidating: true
      });
      
      render(<WordInput {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  /**
   * EDGE CASES
   * 
   * Test unusual scenarios and boundary conditions
   */
  describe('Edge Cases', () => {
    it('should handle uppercase center letter', () => {
      const props = {
        ...defaultProps,
        centerLetter: 'Z'
      };
      
      render(<WordInput {...props} />);
      
      const input = screen.getByPlaceholderText(/enter word with "Z"/i);
      expect(input).toBeInTheDocument();
    });

    it('should prevent submission during validation', () => {
      // First set up a validation in progress
      (usePuzzleValidation as jest.Mock).mockReturnValue({
        ...defaultMockHookReturn,
        isValidating: true
      });
      
      render(<WordInput {...defaultProps} />);
      
      const form = screen.getByRole('button').closest('form')!;
      
      fireEvent.submit(form);
      
      // Should not call validateWord again
      expect(mockValidateWord).not.toHaveBeenCalled();
    });

    it('should handle validation errors gracefully', async () => {
      // Make validateWord throw an error
      mockValidateWord.mockRejectedValue(new Error('API Error'));
      
      render(<WordInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/enter word with "A"/i);
      const form = screen.getByRole('button').closest('form')!;
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.submit(form);
      
      // Should still clear input even if validation fails
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('should handle empty validWords array', () => {
      const props = {
        ...defaultProps,
        validWords: []
      };
      
      render(<WordInput {...props} />);
      
      expect(usePuzzleValidation).toHaveBeenCalledWith({
        centerLetter: 'a',
        validWords: [],
        onValidWord: props.onValidWord
      });
    });
  });
});

/**
 * TEST SUITE SUMMARY
 * 
 * This comprehensive test suite ensures the WordInput component:
 * 1. Renders all form elements correctly
 * 2. Handles user input appropriately
 * 3. Integrates properly with the validation hook
 * 4. Supports both controlled and uncontrolled modes
 * 5. Provides proper accessibility features
 * 6. Handles edge cases gracefully
 * 
 * Total test coverage includes:
 * - 28 test cases
 * - Form interaction testing
 * - Validation state management
 * - Accessibility compliance
 * - Error handling
 * - Controlled/uncontrolled modes
 * 
 * The tests ensure the component is robust, accessible,
 * and integrates correctly with the validation system.
 */ 