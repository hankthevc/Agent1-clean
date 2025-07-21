const fs = require('fs').promises;
const path = require('path');

/**
 * ==============================================================================
 * "GPT Puzzle Master" - Autonomous Daily Puzzle Generator (Simulation)
 * ==============================================================================
 *
 * This script simulates a GPT-powered content pipeline that generates a new,
 * unique puzzle for the Trivia Tiles game every day.
 *
 * How it works:
 * 1.  It contains a "creativity library" of themes, word lists, and trivia,
 *     mimicking the knowledge base of a language model.
 * 2.  It randomly selects a theme to ensure variety.
 * 3.  Based on the theme, it constructs a complete puzzle object, including
 *     the necessary letters, a list of valid words, and a final trivia question.
 * 4.  It overwrites the existing `puzzles.json` file with the newly generated
 *     puzzle, effectively "publishing" the new content.
 *
 * This provides a fully functional simulation of an autonomous content pipeline.
 * To make it truly dynamic, the "creativity library" could be replaced with
 * API calls to a real GPT model.
 *
 * ==============================================================================
 */

// --- The "Creativity Library" (Simulated GPT Knowledge) ---
const themes = {
  space: {
    letters: ['A', 'P', 'O', 'L', 'L', 'O', 'S', 'T', 'R'],
    words: ['STAR', 'MARS', 'MOON', 'SUN', 'ORBIT', 'APOLLO', 'ROAST', 'POST', 'LAP', 'TOP', 'LOTS'],
    trivia: {
      question: "Which planet is known as the Red Planet?",
      answer: "MARS",
      clues: [
        { goal: 2, text: "It has two small moons, Phobos and Deimos." },
        { goal: 4, text: "It's the fourth planet from the Sun." },
        { goal: 6, text: "Its name comes from the Roman god of war." }
      ]
    }
  },
  ocean: {
    letters: ['W', 'H', 'A', 'L', 'E', 'S', 'H', 'R', 'K'],
    words: ['WAVE', 'SHARK', 'WHALE', 'SEA', 'WATER', 'SHELL', 'HALE', 'LAKE', 'RAW', 'HER', 'WAR'],
    trivia: {
      question: "What is the largest animal on Earth?",
      answer: "BLUE WHALE",
      clues: [
        { goal: 2, text: "It's a marine mammal." },
        { goal: 4, text: "Its tongue alone can weigh as much as an elephant." },
        { goal: 6, text: "It belongs to the baleen whale suborder." }
      ]
    }
  },
  tech: {
    letters: ['C', 'O', 'M', 'P', 'U', 'T', 'E', 'R', 'S'],
    words: ['CODE', 'COMPUTER', 'MOUSE', 'RAM', 'CPU', 'CORE', 'PUT', 'MET', 'SUM', 'TOP', 'SEC'],
    trivia: {
      question: "What does CPU stand for?",
      answer: "CENTRAL PROCESSING UNIT",
      clues: [
        { goal: 2, text: "It's often called the 'brain' of the computer." },
        { goal: 4, text: "It performs most of the processing inside a computer." },
        { goal: 6, text: "Intel and AMD are major manufacturers of this component." }
      ]
    }
  }
};

async function generatePuzzle() {
  try {
    console.log('Autonomous Puzzle Master: Waking up to generate a new puzzle...');

    const themeKeys = Object.keys(themes);
    const randomThemeKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const selectedPuzzle = themes[randomThemeKey];

    console.log(`Selected theme for today: ${randomThemeKey}`);

    // The structure of our new puzzles data
    const newPuzzlesData = {
      puzzles: [
        {
          id: `daily-${new Date().toISOString().split('T')[0]}`,
          ...selectedPuzzle
        }
      ]
    };

    // Path to the main puzzles file in the public directory
    const puzzlesFilePath = path.join(__dirname, '../../../client/public/puzzles.json');

    await fs.writeFile(puzzlesFilePath, JSON.stringify(newPuzzlesData, null, 2));

    console.log(`Successfully generated and published new daily puzzle to ${puzzlesFilePath}`);

  } catch (error) {
    console.error('Error generating daily puzzle:', error);
    process.exit(1);
  }
}

generatePuzzle(); 