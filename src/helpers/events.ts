import { MouseEvent } from 'react';

const CLICK_EVENT = 'click';
const KEYDOWN_EVENT = 'keydown';

export const BACKSPACE = 'Backspace';
export const ENTER = 'Enter';

export const eventActions = {
  ADD_LETTER: 'ADD_LETTER',
  CONTINUE: 'CONTINUE',
  DELETE: 'DELETE',
  NONE: 'NONE',
  SCORE_LETTERS: 'SCORE_LETTERS',
  SUBMISSION_ERROR: 'SUBMISSION_ERROR',
  VALIDATE: 'VALIDATE',
}; 

export function getEventKey(event: KeyboardEvent | MouseEvent): string {
  const eventType = event.type;
  if (eventType === CLICK_EVENT) {
    const dataKey = (event.target as HTMLDivElement).getAttribute('data-key');
    if (dataKey === null) return 'Please add data-key attribute.'
    return dataKey;
  } else if (eventType === KEYDOWN_EVENT) {
    return (event as KeyboardEvent).key;
  } else {
    return 'Unknown event type';
  }
}

export function getEventActionType(key: string) {
  if (key === ENTER) {
    return eventActions.VALIDATE;
  } else if (key === BACKSPACE) {
    return eventActions.DELETE;
  } else if (/^[a-zA-Z]{1}$/.test(key)) {
    return eventActions.ADD_LETTER
    // return eventActions.CONTINUE;
  } else {
    return eventActions.NONE;
  }
}