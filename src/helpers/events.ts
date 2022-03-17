import { MouseEvent } from 'react';

export const BACKSPACE = 'Backspace';
export const ENTER = 'Enter';
const DATA_KEY = 'data-key';
const eventTypes = {
  CLICK: 'click',
  KEYDOWN: 'keydown',
};

export const actions = {
  ADD_LETTER: 'ADD_LETTER',
  CONTINUE: 'CONTINUE',
  DELETE: 'DELETE',
  NONE: 'NONE',
  SCORE_LETTERS: 'SCORE_LETTERS',
  SET_DAILY_WORD: 'SET_DAILY_WORD',
  SUBMISSION_ERROR: 'SUBMISSION_ERROR',
  VALIDATE_ASYNC: 'VALIDATE_ASYNC',
}; 

export function toEventKey(event: KeyboardEvent | MouseEvent): string {
  if (event.type === eventTypes.CLICK) {
    const dataKey = (event.target as HTMLDivElement).getAttribute(DATA_KEY);
    if (!dataKey) {
      return 'No data-key attribute found.';
    }
    return dataKey;
  } else if (event.type === eventTypes.KEYDOWN) {
    return (event as KeyboardEvent).key;
  }
  return 'Unknown event type.';
}

export function toEventActionType(key: string) {
  if (key === ENTER) {
    return actions.VALIDATE_ASYNC;
  } else if (key === BACKSPACE) {
    return actions.DELETE;
  } else if (/^[a-zA-Z]{1}$/.test(key)) {
    return actions.ADD_LETTER
  }
  return actions.NONE;
}