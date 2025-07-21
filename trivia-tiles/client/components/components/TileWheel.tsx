import React from 'react';

/**
 * TileWheelProps Interface
 * 
 * Defines the minimal props needed for the TileWheel component.
 * The component handles all geometric calculations internally.
 */
export interface TileWheelProps {
  center: string;              // Single letter displayed in the center
  outer: string[];             // Array of 6 letters for the outer tiles
  onLetterClick?: (letter: string) => void;  // Callback when a letter is clicked
}

/**
 * TileWheel Component
 * 
 * Creates an interactive hexagonal tile arrangement for the word puzzle game.
 * Features a center tile surrounded by 6 outer tiles in a perfect hexagon.
 * 
 * GEOMETRIC DESIGN:
 * - Center tile at origin (0, 0)
 * - Outer tiles positioned using polar coordinates
 * - 60-degree separation between outer tiles (360° / 6 tiles)
 * - Responsive sizing based on container width
 * 
 * INTERACTIVE FEATURES:
 * - Click/tap any tile to append its letter to the word input
 * - Visual feedback on hover and click
 * - Keyboard accessible with proper ARIA labels
 * - Touch-friendly on mobile devices
 * 
 * RESPONSIVE DESIGN:
 * - Scales automatically with container
 * - Mobile-optimized with larger tap targets
 * - Smooth transitions and animations
 * - Works across all screen sizes
 */
export const TileWheel: React.FC<TileWheelProps> = ({ center, outer, onLetterClick }) => {
  /**
   * CONSTANTS FOR HEXAGONAL LAYOUT
   * 
   * These values create the perfect hexagonal arrangement:
   * - RADIUS: Distance from center to outer tiles
   * - TILE_SIZE: Diameter of each circular tile
   * - SVG_SIZE: Total size of the SVG viewport
   */
  const RADIUS = 80;          // Distance from center to outer tiles
  const TILE_SIZE = 50;       // Size of each tile
  const SVG_SIZE = 250;       // Total SVG canvas size
  const CENTER = SVG_SIZE / 2; // Center point of the SVG

  /**
   * CALCULATE TILE POSITIONS
   * 
   * Uses trigonometry to position tiles in a perfect hexagon:
   * - Starts at 0° (3 o'clock position)
   * - Each subsequent tile is 60° clockwise
   * - Converts polar to Cartesian coordinates
   * 
   * Math explanation:
   * - angle = index * 60° (in radians: index * π/3)
   * - x = center + radius * cos(angle)
   * - y = center + radius * sin(angle)
   */
  const getTilePosition = (index: number) => {
    const angle = (index * Math.PI) / 3; // 60 degrees in radians
    const x = CENTER + RADIUS * Math.cos(angle);
    const y = CENTER + RADIUS * Math.sin(angle);
    return { x, y };
  };

  /**
   * LETTER CLICK HANDLER
   * 
   * Handles user interaction with tiles:
   * - Prevents default behavior
   * - Calls parent callback with clicked letter
   * - Provides consistent behavior across click/tap
   * 
   * This enables the core gameplay mechanic where clicking
   * tiles populates the word input field.
   */
  const handleLetterClick = (letter: string) => {
    if (onLetterClick) {
      onLetterClick(letter);
    }
  };

  /**
   * KEYBOARD INTERACTION HANDLER
   * 
   * Makes tiles keyboard accessible:
   * - Enter/Space keys trigger click action
   * - Provides equivalent functionality to mouse/touch
   * - Essential for accessibility compliance
   */
  const handleKeyDown = (event: React.KeyboardEvent, letter: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLetterClick(letter);
    }
  };

  return (
    <div className="tile-wheel-container inline-block">
      {/**
       * SVG CONTAINER - RESPONSIVE DESIGN
       * 
       * The SVG scales to fit its container while maintaining aspect ratio.
       * On mobile devices, the parent component scales this down slightly
       * to ensure it fits comfortably on smaller screens.
       * 
       * Accessibility features:
       * - Role and aria-label for screen readers
       * - Focusable elements for keyboard navigation
       */}
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-full h-full max-w-[250px] max-h-[250px]"
        role="img"
        aria-label="Letter wheel with center and outer tiles"
      >
        {/**
         * OUTER TILES - HEXAGONAL ARRANGEMENT
         * 
         * Renders 6 tiles in a perfect hexagon around the center.
         * Each tile is positioned using calculated coordinates.
         * 
         * Interactive features:
         * - Hover effects for desktop users
         * - Active states for click feedback
         * - Touch-friendly tap targets
         * 
         * The group element with className handles all the interactive
         * styling through Tailwind's group hover utilities.
         */}
        {outer.map((letter, index) => {
          const { x, y } = getTilePosition(index);
          return (
            <g
              key={`outer-${index}`}
              className="cursor-pointer group"
              onClick={() => handleLetterClick(letter)}
              onKeyDown={(e) => handleKeyDown(e, letter)}
              tabIndex={0}
              role="button"
              aria-label={`Select letter ${letter.toUpperCase()}`}
            >
              {/**
               * TILE BACKGROUND CIRCLE
               * 
               * Provides visual boundary and interactive states:
               * - Default: Light gray background
               * - Hover: Blue background with transition
               * - Active: Slightly scaled for feedback
               */}
              <circle
                cx={x}
                cy={y}
                r={TILE_SIZE / 2}
                className="fill-gray-200 stroke-gray-400 stroke-2 
                           transition-all duration-200
                           group-hover:fill-blue-100 group-hover:stroke-puzzle-blue
                           group-active:scale-95"
              />
              {/**
               * TILE LETTER TEXT
               * 
               * Displays the letter with proper centering:
               * - text-anchor="middle" for horizontal centering
               * - dominant-baseline="central" for vertical centering
               * - Larger font for better visibility
               * - Color changes on hover for feedback
               */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-2xl font-bold fill-gray-700 select-none
                           transition-colors duration-200
                           group-hover:fill-puzzle-blue"
                style={{ pointerEvents: 'none' }}
              >
                {letter.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/**
         * CENTER TILE - MANDATORY LETTER
         * 
         * The center tile is visually distinct to indicate its special status.
         * In the game rules, words must contain this letter.
         * 
         * Design choices:
         * - Larger size than outer tiles for emphasis
         * - Gold color to indicate importance
         * - Same interactive behavior as outer tiles
         * - Smooth transitions for professional feel
         */}
        <g
          className="cursor-pointer group"
          onClick={() => handleLetterClick(center)}
          onKeyDown={(e) => handleKeyDown(e, center)}
          tabIndex={0}
          role="button"
          aria-label={`Select center letter ${center.toUpperCase()} (required in all words)`}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={TILE_SIZE / 2 + 5}
            className="fill-puzzle-gold stroke-yellow-700 stroke-2 
                       transition-all duration-200
                       group-hover:fill-yellow-300 group-hover:stroke-yellow-800
                       group-active:scale-95"
          />
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-3xl font-bold fill-gray-800 select-none
                       transition-colors duration-200"
            style={{ pointerEvents: 'none' }}
          >
            {center.toUpperCase()}
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * RESPONSIVE DESIGN SUMMARY:
 * 
 * 1. SCALABLE VECTOR GRAPHICS:
 *    - SVG naturally scales to any size
 *    - Maintains crisp appearance on all screens
 *    - No pixelation on high-DPI displays
 * 
 * 2. MOBILE OPTIMIZATIONS:
 *    - Large tap targets (50px+ diameter)
 *    - Clear visual feedback for touches
 *    - Scales down gracefully on small screens
 *    - No hover-dependent functionality
 * 
 * 3. INTERACTION DESIGN:
 *    - Works with mouse, touch, and keyboard
 *    - Clear focus indicators for accessibility
 *    - Smooth transitions enhance perceived performance
 *    - Active states provide immediate feedback
 * 
 * 4. PERFORMANCE:
 *    - Minimal DOM elements (just circles and text)
 *    - CSS transitions instead of JavaScript animations
 *    - Efficient event delegation
 *    - No unnecessary re-renders
 * 
 * 5. ACCESSIBILITY:
 *    - Full keyboard navigation
 *    - Descriptive ARIA labels
 *    - Semantic button roles
 *    - High contrast colors
 * 
 * 6. INTEGRATION:
 *    - Parent controls sizing through transform scale
 *    - Clean prop interface for easy usage
 *    - No external dependencies beyond React
 *    - Works in any container
 */
