import { Dispatch } from 'react';
import {
  createGameBoard,
  createKeyboardRows,
  getEndState,
  mapScores,
  scoreWordByLetter,
} from '../helpers';
import { eventActions } from '../helpers/events';
import type {
  Action,
  State,
} from '../types';

const BASE_VALIDATE_WORD_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const submissionErrors = {
  MIN_LENGTH: 'Not enough letters.',
  INVALID_WORD: 'Not in word list.',
  GENERIC: 'Something went wrong.',
}

export const initialState: State = {
  activeCol: 0,
  activeRow: 0,
  endState: null,
  gameBoard: createGameBoard(),
  keyboard: createKeyboardRows(),
  submissionError: null,
  submittedWords: [],
  word: '',
}

// break into multiple reducers
export function reducer(state: State, action: Action): State {
  const {
    activeCol,
    activeRow,
    gameBoard,
    keyboard,
    submittedWords,
    word,
  } = state;

  const maxWordLength = gameBoard[0].length;
  const maxSubmissionsLength = gameBoard.length;
  let nextGameBoard = [ ...gameBoard ];
  let nextWord;

  switch (action.type) {
    case eventActions.CONTINUE:
      nextWord = word + action.payload;
      if (nextWord.length > maxWordLength) {
        return state;
      }

      nextGameBoard[activeRow][activeCol] = {
        char: action.payload,
        score: null,
      }

      return {
        ...state,
        activeCol: activeCol + 1,
        gameBoard: nextGameBoard,
        word: nextWord,
      }
    case eventActions.DELETE:
      if (word === '') return state;

      nextWord = word.slice(0, word.length - 1);

      nextGameBoard[activeRow][activeCol - 1] = {
        char: null,
        score: null,
      }

      return {
        ...state,
        activeCol: activeCol - 1,
        gameBoard: nextGameBoard,
        word: nextWord,
      }
    case eventActions.NONE:
    case eventActions.VALIDATE:
      return state;
    case eventActions.SCORE_WORD: 

      const wordOfTheDay = action.payload;
      const submittedWord = word;
      const score = scoreWordByLetter(submittedWord, wordOfTheDay);

      // move into another function and write tests
      const scoreMap = new Map();
      for (const i in score) {
        const letter = submittedWord[i];
        if (scoreMap.has(letter)) {
          if (score[i] > scoreMap.get(letter)) {
            scoreMap.set(letter, score[i]);
          }
        } else {
          scoreMap.set(letter, score[i]);
        }

        nextGameBoard[activeRow][i] = {
          ...nextGameBoard[activeRow][i],
          score: score[i],
        };
      }

      const nextKeyboard = mapScores(keyboard, scoreMap);
      // TODO: calculate all stats
      const nextEndState = getEndState(
        score,
        submittedWords.length + 1,
        maxSubmissionsLength,
        maxWordLength,
        wordOfTheDay
      );

      return {
        ...state,
        activeCol: 0,
        activeRow: activeRow + 1,
        endState: nextEndState,
        gameBoard: nextGameBoard,
        keyboard: nextKeyboard,
        submittedWords: [
          ...submittedWords,
          submittedWord,
        ],
        word: '',
      };
    case eventActions.SUBMISSION_ERROR:
      console.log('reducer', action)
      return {
        ...state,
        submissionError: action.payload
      };
    default:
      throw new Error('No such action type.');
  }
}

export function asyncDispatch(
  wordOfTheDay: string,
  state: State,
  dispatch: (action: Action) => any)
{
  const { gameBoard, word } = state;

  if (word.length < gameBoard[0].length) {
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
      type: eventActions.SCORE_WORD,
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