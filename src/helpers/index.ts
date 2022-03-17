import type {
  BoardState,
  KeyboardType,
  Tile,
} from '../types';

const gameStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  LOSE: 'LOSE',
  WIN: 'WIN',
};

export function mapLettersToIndex(word: string): Map<string, string> {
  const map = new Map();
  const charList = word.split('');
  for (let i in charList) {
    map.has(charList[i])
      ? map.get(charList[i]).push(i)
      : map.set(charList[i], [i]);
  }
  return map;
}

export function scoreLetters(letters: string, target: string): string[] {
  const scores: string[] = [...Array(letters.length)];
  const mappedTarget = mapLettersToIndex(target);

  let alreadyScored: any = new Set();

  const letterList = letters.split('');
  for (let i in letterList) {
    const letter = letterList[i];
    if (mappedTarget.has(letter)) {
      if (mappedTarget.get(letter)?.includes(i)) {
        if (!alreadyScored.has(letter)) alreadyScored.add(letter);
        scores[i] = 'correct';
      } else {
        if (alreadyScored.has(letter)) {
          scores[i] = 'absent'
        } else {
          alreadyScored.add(letter);
          scores[i] = 'present';
        }
      }
    } else {
      scores[i] = 'absent';
    }
  }

  return scores;
}

type AlphabetMap = Record<string, null>;
export function initAlphabetMap(): AlphabetMap {
  const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const map: Record<string, null> = {};
  for (let i in alpha) {
    map[alpha[i]] = null;
  }
  return map;
}

export function mapScores(
  letterMap: KeyboardType,
  scores: Map<string, string>
): KeyboardType {
  const nextLetterMap = letterMap
    .flat()
    .reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      const value = scores.has(key)
        ? scores.get(key)
        : curr[key];
      return {
        ...acc,
        [key]: value!,
      };
    }, {} as Record<string, string>);
    
  return listToKeyboardRows(mapToList(nextLetterMap));
}

export function mapKeyboardScores(
  keyboard: KeyboardType,
  letters: string,
  score: string[],
): KeyboardType {
  const scoreMap = new Map<string, string>();

  for (const i in score) {
    const letter = letters[i];
    if (scoreMap.has(letter)) {
      const value = scoreMap.get(letter);
      if (value && score[i] > value) {
        scoreMap.set(letter, score[i]);
      }
    } else {
      scoreMap.set(letter, score[i]);
    }
  }

  return mapScores(keyboard, scoreMap);
}

type NextLetterMap = any;
type MappedList = Record<string, string | null>[];
function mapToList(map: AlphabetMap | NextLetterMap): MappedList {
  const list = [];
  for (const key in map) {
    list.push({ [key]: map[key] });
  }
  
  return list;
}

function listToKeyboardRows(list: MappedList): KeyboardType {
  const keyboardRows = [
    list.slice(0, 10),
    list.slice(10, 19),
    list.slice(19),
  ];
  
  return keyboardRows;
}

const keyboardOrdering: number[] = [10,23,21,12,2,13,14,15,7,16,17,18,25,24,8,9,0,3,11,4,6,22,1,20,5,19];

export function createKeyboardRows (): KeyboardType {
  const list = mapToList(initAlphabetMap());

  const keyboard = orderListBy(list, keyboardOrdering);
  
  return listToKeyboardRows(keyboard);
}

export function orderListBy(list: MappedList, orderingList: number[]): Record<any, any>[] {
  const ordered = Array(list.length);
  list.forEach((el, i) => ordered[orderingList[i]] = el);

  return ordered;
}

export function createGameBoard(): Tile[][] {
  return [...Array(6)]
    .map(_ => Array(5)
      .fill({
        char: null,
        score: null,
      })
    );
};

export function isAlphabetChar(str: string): boolean {
  return /^[a-zA-Z]{1}$/.test(str);
}

function correct(val: string) {
  return val === 'correct';
}

export function getGameStatus(
  boardState: BoardState,
  score: string[],
) {
  let status = gameStatus.IN_PROGRESS;
  if (score.every(correct)) {
    status = gameStatus.WIN;
  } else if (boardState[boardState.length - 1]) {
    status = gameStatus.LOSE;
  }
  return status;
}

export function getEndState(
  score: number[],
  numWords: number,
  maxWords: number,
  maxLen: number,
  wordOfTheDay: string,
) {
  if (totalScore(score) === maxLen) {
    // TODO: what to return here
    return 'Congratulations on guessing today\'s word!';
  } else if (numWords === maxWords) {
    return wordOfTheDay;
  }
  return null;
}

export function totalScore(score: number[]) {
  return score
    .reduce((acc, curr) =>
      acc += curr
    );
}