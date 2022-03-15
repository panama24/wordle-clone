type Action = {
  type: string;
  payload: string;
}

type GameBoardType = Tile[][];

type KeyboardType = Record<string, number | null>[][];

type State = {
  activeCol: number;
  activeRow: number;
  endState: string | null,
  gameBoard: GameBoardType;
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
  GameBoardType,
  KeyboardType,
  State,
  Tile
};