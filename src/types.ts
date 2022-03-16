type Action = {
  type: string;
  payload: string;
}

type Board = Tile[][];
export type BoardState = string[];
export type Scores = null[] | string[][];

type KeyboardType = Record<string, number | null>[][];

type State = {
  activeCol: number;
  activeRow: number;
  endState: string | null,
  gameBoard: Board;

  board: any;
  boardState: BoardState;
  scores: Scores;

  keyboard: KeyboardType;
  submissionError: string | null;
  submittedWords: string[];
  word: string;
}

type Tile = {
  char: string | null;
  score: number | null;
}

export {
  Action,
  Board,
  KeyboardType,
  State,
  Tile
};