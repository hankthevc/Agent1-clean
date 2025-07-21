// src/types/PuzzleTypes.ts
export interface Puzzle {
  centralLetter: string;
  outerLetters: string[];
  validWords: string[];
  triviaClues: { [word: string]: string };
  finalTrivia: {
    question: string;
    answer: string;
  };
}
