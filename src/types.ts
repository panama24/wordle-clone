type Action = {
  type: string;
  payload: string;
}

export type Board = null[][];
export type BoardState = string[];
export type Scores = null[] | string[][];

type KeyboardType = Record<string, string | null> [][];

type State = {
  activeCol: number;
  activeRow: number;
  board: any;
  boardState: BoardState;
  gameStatus: string;
  scores: Scores;
  keyboard: KeyboardType;
  submissionError: string | null;
}

type Tile = {
  char: string | null;
  score: number | null;
}

export {
  Action,
  KeyboardType,
  State,
  Tile
};