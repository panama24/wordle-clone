import type {
  KeyboardType,
  Tile,
} from '../types';

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

export function scoreWordByLetter(word: string, target: string): number[] {
  let letterScores = [...Array(word.length)];
  let scored: string[] = [];
  const targetStrMap = mapLettersToIndex(target);

  const charList = word.split('');
  for (let i in charList) {
    if (targetStrMap.has(charList[i])) {
      if (targetStrMap.get(charList[i])?.includes(i)) {
        if (!scored.includes(charList[i])) scored.push(charList[i]);
        letterScores[i] = 1;
      } else {
        if (scored.includes(charList[i])) {
          letterScores[i] = -1;
        } else {
          scored.push(charList[i]);
          letterScores[i] = 0;
        }
      }
    } else {
      letterScores[i] = -1;
    }
  }

  return letterScores;
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

export function mapScores(letterMap: KeyboardType, scores: Map<string, number>) {
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
    }, {} as Record<string, number | null>);
    
  return listToKeyboardRows(mapToList(nextLetterMap));
}

type NextLetterMap = any;
type MappedList = Record<string, number>[];
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

export const createKeyboardRows = () => {
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