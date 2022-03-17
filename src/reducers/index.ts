import { Dispatch } from 'react';
import {
  createKeyboardRows,
  mapKeyboardScores,
  scoreLetters,
} from '../helpers';
import { eventActions } from '../helpers/events';
import type {
  Action,
  BoardState,
  Scores,
  State,
} from '../types';

const BASE_VALIDATE_WORD_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const submissionErrors = {
  MIN_LENGTH: 'Not enough letters.',
  INVALID_WORD: 'Not in word list.',
  GENERIC: 'Something went wrong.',
}

const createBoard = (): null[][] => [...Array(6)]
  .map(_ => (
    Array(5)
      .fill(null)
  ));

const initBoardState = (): BoardState => [...Array(6).fill('')];
const initScores = (): Scores => [...Array(6)]
  .map(_ => (
    Array(5)
      .fill(null)
  ));

export const initialState: State = {
  activeCol: 0,
  activeRow: 0,
  board: createBoard(),
  boardState: initBoardState(),
  gameStatus: 'IN_PROGRESS',
  scores: initScores(),
  keyboard: createKeyboardRows(),
  submissionError: null,
}

// break into multiple reducers
export function reducer(state: State, action: Action): State {
  const {
    activeRow,
    board, 
    boardState,
    scores,
    keyboard,
  } = state;

  let currentWord;

  switch (action.type) {
    case eventActions.DELETE:
      currentWord = boardState[activeRow];

      if (currentWord === '') return state;

      return {
        ...state,
        boardState: [
          ...boardState.slice(0, activeRow),
          currentWord.slice(0, currentWord.length - 1),
          ...boardState.slice(activeRow + 1),
        ]
      }
    case eventActions.NONE:
    case eventActions.VALIDATE:
      return state;
    case eventActions.SCORE_LETTERS: 
      const wordOfTheDay = action.payload;
      const submittedWord = boardState[activeRow];

      const score = scoreLetters(submittedWord, wordOfTheDay);
      const nextScores =  [
        ...scores.slice(0, activeRow),
        score,
        ...scores.slice(activeRow + 1),
      ] as Scores;

      const nextKeyboard = mapKeyboardScores(
        keyboard,
        submittedWord,
        score,
      );

      // // TODO: calculate all stats
      // move this out
      let nextGameStatus = 'IN_PROGRESS';
      if (score.every(letterScore => letterScore === 'correct')) {
        nextGameStatus = 'WIN';
      } else if (boardState[boardState.length - 1] !== '') {
        nextGameStatus = 'LOSE';
      }

      return {
        ...state,
        activeCol: 0,
        activeRow: activeRow + 1,
        gameStatus: nextGameStatus,
        keyboard: nextKeyboard,
        scores: nextScores,
      };
    case eventActions.SUBMISSION_ERROR:
      return {
        ...state,
        submissionError: action.payload
      };
    case eventActions.ADD_LETTER:
      currentWord = boardState[activeRow];
      currentWord += action.payload;

      if (currentWord.length > board[0].length) return state;

      return {
        ...state,
        boardState: [
          ...boardState.slice(0, activeRow),
          currentWord,
          ...boardState.slice(activeRow + 1),
        ]
      }
    default:
      throw new Error('No such action type.');
  }
}

export function asyncDispatch(
  wordOfTheDay: string,
  state: State,
  dispatch: (action: Action) => any)
{
  const {
    activeRow,
    board,
    boardState,
  } = state;

  const word = boardState[activeRow];

  if (word.length < board[0].length) {
    let timerId = setTimeout(() => {
      dispatch({
        type: eventActions.SUBMISSION_ERROR,
        payload: '',
      });
    }, 2000);

    dispatch({
      type: eventActions.SUBMISSION_ERROR,
      payload: submissionErrors.MIN_LENGTH,
    });
  } else {
    try {
      validate(wordOfTheDay, word, dispatch);
    } catch (error) {
      let timerId = setTimeout(() => {
        dispatch({
          type: eventActions.SUBMISSION_ERROR,
          payload: '',
        });
      }, 2000);

      dispatch({
        type: eventActions.SUBMISSION_ERROR,
        payload: submissionErrors.GENERIC,
      })
    }
  }
};

async function validate(
  wordOfTheDay: string,
  word: string,
  dispatch: Dispatch<Action>
) {
  const response = await fetch(BASE_VALIDATE_WORD_URL + word);
  const result = await response.json();
  if (Array.isArray(result)) {
    dispatch({
      type: eventActions.SCORE_LETTERS,
      payload: wordOfTheDay
    });
  } else {
    let timerId = setTimeout(() => {
      dispatch({
        type: eventActions.SUBMISSION_ERROR,
        payload: '',
      });
    }, 2000);

    dispatch({
      type: eventActions.SUBMISSION_ERROR,
      payload: submissionErrors.INVALID_WORD,
    });
  }
}