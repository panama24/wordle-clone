import styled from 'styled-components';
import Key from './Key';
import { BACKSPACE, ENTER } from '../../helpers/events';
import { KeyboardType } from '../../types';

type KeyboardProps = {
  keyboard: KeyboardType;
  onClick: any;
}

export default function Keyboard({
  keyboard,
  onClick,
}: KeyboardProps) {
  return (
    <KeyboardContainer>
      {keyboard.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map(keyboardKey => {
            const key = Object.keys(keyboardKey)[0];
            return (
              <Key
                bg={getBg(keyboardKey[key])}
                data-key={key}
                key={key}
                label={key}
                onClick={onClick}
              />
            )
          })}
        </div>
      ))}
      <Key
        bg={getBg(null)}
        data-key={ENTER}
        label={ENTER}
        onClick={onClick}
        style={{
          ...sharedKeyStyles,
          left: '2px',
        }}
      />
      <Key
        bg={getBg(null)}
        data-key={BACKSPACE}
        label='del'
        onClick={onClick}
        style={{
          ...sharedKeyStyles,
          right: '2px',
        }}
      />
    </KeyboardContainer>
  )
}

const getBg = (score: string | null): string => {
  if (score === 'correct') return '#6aaa64';
  if (score === 'present') return '#c9b458';
  if (score === 'absent') return '#3a3a3c';
  return '#818384';
}

const sharedKeyStyles = {
  position: 'absolute',
  bottom: '0',
  width: '64px',
}

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;