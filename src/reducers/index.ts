import { Dispatch } from 'react';
import {
  createKeyboardRows,
  getGameStatus,
  mapKeyboardScores,
  scoreLetters,
} from '../helpers';
import { actions } from '../helpers/events';
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
  activeRow: 0,
  board: createBoard(),
  boardState: initBoardState(),
  gameStatus: 'IN_PROGRESS',
  scores: initScores(),
  keyboard: createKeyboardRows(),
  submissionError: null,
  wordOfTheDay: '',
}

// break into multiple reducers
export function reducer(state: State, action: Action): any {
  const {
    activeRow,
    board, 
    boardState,
    scores,
    keyboard,
    wordOfTheDay,
  } = state;

  let currentWord = boardState[activeRow];

  switch (action.type) {
    case actions.DELETE:
      if (currentWord === '') return state;

      return {
        ...state,
        boardState: [
          ...boardState.slice(0, activeRow),
          currentWord.slice(0, currentWord.length - 1),
          ...boardState.slice(activeRow + 1),
        ]
      }
    case actions.NONE:
      return state;
    case actions.SCORE_LETTERS: 
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
      return {
        ...state,
        activeRow: activeRow + 1,
        gameStatus: getGameStatus(boardState, score),
        keyboard: nextKeyboard,
        scores: nextScores,
      };
    case actions.SUBMISSION_ERROR:
      return {
        ...state,
        submissionError: action.payload
      };
    case actions.ADD_LETTER:
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
    case actions.SET_DAILY_WORD:
      return {
        ...state,
        wordOfTheDay: action.payload,
      }
    default:
      throw new Error('No such action type.');
  }
}

export function asyncDispatch(
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
    setTimeout(() => {
      dispatch({
        type: actions.SUBMISSION_ERROR,
        payload: '',
      });
    }, 2000);

    dispatch({
      type: actions.SUBMISSION_ERROR,
      payload: submissionErrors.MIN_LENGTH,
    });
  } else {
    try {
      validate(BASE_VALIDATE_WORD_URL + word, dispatch);
    } catch (error) {
      setTimeout(() => {
        dispatch({
          type: actions.SUBMISSION_ERROR,
          payload: '',
        });
      }, 2000);

      dispatch({
        type: actions.SUBMISSION_ERROR,
        payload: submissionErrors.GENERIC,
      })
    }
  }
};

async function validate(
  url: string,
  dispatch: Dispatch<Action>
) {
  const response = await fetch(url);
  const result = await response.json();
  if (Array.isArray(result)) {
    dispatch({ type: actions.SCORE_LETTERS });
  } else {
    setTimeout(() => {
      dispatch({
        type: actions.SUBMISSION_ERROR,
        payload: '',
      });
    }, 2000);

    dispatch({
      type: actions.SUBMISSION_ERROR,
      payload: submissionErrors.INVALID_WORD,
    });
  }
}