
import styled from 'styled-components';

type ModalProps = {
  content: any;
  isOpen: boolean;
  close: () => void;
}

function Modal(props: ModalProps) {
  const { isOpen, ...contentProps } = props;
  return (
    <Overlay show={isOpen}>
      <ModalContent {...contentProps }/>
    </Overlay>
  )
}

const guessDistribution = {
  1: 0,
  2: 2,
  3: 5,
  4: 3,
  5: 1,
  6: 1,
};

const statistics = {
  currentStreak: 1,
  maxStreak: 7,
  played: 13,
  win: 97, // wins % games played
};

// local storage: wordle statistics
/**
 * avg guesses
 * current streak
 * games played
 * games won
 * guesses: { 1:1, 2:0, 3:0, 4:0, 5:0, 6:0, fail: 1 }
 * max streak
 * winPercentage
 */

// localStorage wordle state - last completed timestamp, last played timestamp

function ModalContent({
  close,
  content,
}: Omit<ModalProps, 'isOpen'>) {
  const {
    currentStreak,
    maxStreak,
    played,
    win,
   } = statistics;
  const nextWordle = '13:52:39';

  return (
    <ContentContainer>
      <span onClick={close}>X</span>
      <Content>
        <div>STATISTICS</div>
        <div style={{ display: 'flex' }}>
          <div>Played</div>
          <div>Win %</div>
          <div>Current Streak</div>
          <div>Max Streak</div>
        </div>
        <div>GUESS DISTRIBUTION</div>
        <div>BAR CHART</div>
        <div>NEXT WORDLE</div>
        <div style={{ display: 'flex' }}>
          <div>HH:MM:SS</div>
          <div>|</div>
          <div>SHARE</div>
        </div>
      </Content>
    </ContentContainer>
  )
}

const ContentContainer = styled.div`
  background: #1a1a1b;
  color: white;
  width: 60%;
  height: 60%;
  padding: 24px;
  border-radius: 9px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div<{ show: boolean }>`
  display: ${({ show }) => show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  background: rgba(0,0,0,0.5);
`;

export default Modal;