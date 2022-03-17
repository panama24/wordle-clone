import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { usePrevious } from '../hooks/usePrevious';
import type {
  Board,
  BoardState,
  Scores,
} from '../types';

const DELAY_MULTIPLIER = .2;

function calculateDelay(index: number): number {
  return index * DELAY_MULTIPLIER;
};

const initTilesRef: null[][] = [...Array(6)].map(_ => Array(5).fill(null));

type Props = {
  activeRow: number;
  board: Board,
  boardState: BoardState;
  scores: Scores;
  submissionError: string | null;
}
   
function GameBoard({
  activeRow,
  board,
  boardState,
  scores,
  submissionError,
}: Props) {
  const tilesRef = useRef<null[][] | HTMLDivElement[][]>(initTilesRef);

  useEffect(() => {
    if (activeRow > 0) {
      if (tilesRef.current) {
        const rowRefs = [...tilesRef.current[activeRow - 1]];
        for (const rowRef of rowRefs) {
          rowRef?.classList.toggle('flipped');
        }
      }
    }
  }, [activeRow]);

  // Todo: this should happen multiple times in a row
  // maybe fire a specific action instead of relying on submission error
  // which resets on a delay
  useEffect(() => {
    if (tilesRef.current) {
      if (submissionError) {
        const refs = activeRow === 0
          ? [...tilesRef.current[0]]
          : [...tilesRef.current[activeRow]];
        for (const ref of refs) {
          ref?.classList.toggle('shake');
        }
      }
    }
  }, [activeRow, submissionError]);

  return (
    <div style={{ display: 'inline-block' }}>
      <BoardContainer rows={board.length}>
        {board.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((_, colIndex) => {
              const rowScore = scores[rowIndex];
              return (
                <TileContainer
                  colIndex={colIndex}
                  key={`${rowIndex}-${colIndex}`}
                  ref={el => tilesRef.current[rowIndex][colIndex] = el}
                  letter={boardState[rowIndex][colIndex]}
                  score={rowScore ? rowScore[colIndex] : null}
                />
              )
            })}
          </Row>
        ))}
      </BoardContainer>
    </div>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 9px;
`;

type TileProps = {
  colIndex: number;
  letter: string | null;
  score: any;
}

const TileContainer = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  const {
    colIndex,
    letter,
    score,
  } = props;

  const [isActive, setIsActive] = useState<boolean>(false);

  const prevLetter = usePrevious(letter);
  useEffect(() => {
    const active = !prevLetter && !!letter;
    active
      ? setIsActive(true)
      : setIsActive(false);
  }, [prevLetter, letter]);

  return (
    <Flippable
      ref={ref}
      secs={colIndex}
    >
      <FlippableFront>
        <StyledTile
          className={isActive ? 'active' : ''}
          score={null}
          letter={''}
        >
          {letter}
        </StyledTile>
      </FlippableFront>
      <FlippableBack>
        <StyledTile score={score} letter={''}>
          {letter}
        </StyledTile>
      </FlippableBack>
    </Flippable>
  )
});

const shakeAnimation = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const Flippable = styled.div<{ secs: number }>`
  position: relative;
  background: transparent;
  width: 64px;
  height: 64px;
  perspective: 1000px;
  transition: ${({ secs }) => `all .3s ease-in-out ${calculateDelay(secs)}s`};

  &.flipped {
    & > div:first-of-type {
      transform: perspective(1000px) rotateX(-180deg);
      transition: ${({ secs }) => `all .3s ease-in-out ${calculateDelay(secs)}s`};
    }

    & > div:last-of-type {
      transform: perspective(1000px) rotateX(0deg);
      transition: ${({ secs }) => `all .3s ease-in-out ${calculateDelay(secs)}s`};
    }
  }

  &.shake {
    animation: ${shakeAnimation} 0.6s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }
`;

const sharedFlipStyles = `
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const FlippableFront = styled.div`
  ${sharedFlipStyles}
`;

const FlippableBack = styled.div`
  ${sharedFlipStyles}
  transform: rotateX(-180deg);
`;

// make constants
const pressAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.09); }
  100% { transform: scale(1); }
`;

const StyledTile = styled.div<{
  letter: string,
  score: string | null,
}>`
  width: 64px;
  height: 64px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ score }) => toDisplayColor(score, true)};
  border: 2px solid ${({ score }) => toDisplayColor(score)};

  &::before {
    content: '${({ letter }) => letter}';
  }

  &.active {
    border: 2px solid #565758;
    animation: ${pressAnimation} .1s ease-in-out;
  }
`;

function toDisplayColor(
  score: string | null,
  defaultToTransparent = false,
) {
  if (score === 'correct') return '#6aaa64';
  if (score === 'present') return '#c9b458';
  if (score === 'absent') return '#3a3a3c';
  return defaultToTransparent ? 'transparent' : '#3a3a3c';
}

const BoardContainer = styled.div<{ rows: number }>`
  background: #121213;
  display: grid;
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 1fr)`};
  grid-gap: 9px;
  padding: 5px;
  box-sizing: border-box;
`;

export default GameBoard;
