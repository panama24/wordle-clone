import {
  MouseEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import styled from 'styled-components';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard/Board';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { isAlphabetChar } from './helpers';
import {
  BACKSPACE,
  ENTER,
  eventActions,
  getEventKey,
  getEventActionType,
} from './helpers/events';
import { usePrevious } from './hooks/usePrevious';
import {
  asyncDispatch,
  initialState,
  reducer,
} from './reducers';

const WORD_URL = 'https://api.frontendeval.com/fake/word';

// TODO: save previously SUBMITTED words in local storage
// TODO: nav modal (clicking on stats), game modal (win or lose modal)

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [wordOfTheDay, setWordOfTheDay] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWord() {
      const response = await fetch(WORD_URL);
      const word = await response.text();
      setWordOfTheDay(word);
    }
    fetchWord();
  }, []);

  const handleEvent = useCallback((event: KeyboardEvent | MouseEvent) => {
    event.preventDefault();

    if (state.endState) return;

    const key = getEventKey(event);
    const actionType = getEventActionType(key);
    console.log('actionType', actionType);
     
    actionType === eventActions.VALIDATE
      ? asyncDispatch(wordOfTheDay, state, dispatch)
      : dispatch({
        type: actionType,
        payload: key,
      });
  }, [
    dispatch,
    state,
    wordOfTheDay,
  ]);

  // const handleEvent = useCallback((event: KeyboardEvent | MouseEvent) => {
  //   event.preventDefault();

  //   if (state.endState) return;

  //   const key = getEventKey(event);
  //   const actionType = getEventActionType(key);
  //   actionType === eventActions.VALIDATE
  //     ? asyncDispatch(wordOfTheDay, state, dispatch)
  //     : dispatch({
  //       type: actionType,
  //       payload: key,
  //     });
  // }, [
  //   dispatch,
  //   state,
  //   wordOfTheDay,
  // ]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const {
        key,
        metaKey,
      } = event as KeyboardEvent;
      // allow keyboard shortcuts - explicitly handle only single letters, enter or delete
      if (!metaKey) {
        if (
          isAlphabetChar(key)
          || key === ENTER
          || key === BACKSPACE
        ) {
          handleEvent(event);
        }
      }
    }

    document.addEventListener('keydown', handleKeydown);

    return () =>
      document.removeEventListener('keydown', handleKeydown);
  }, [handleEvent]);

  const previousEndState = usePrevious(state.endState);
  useEffect(() => {
    const isGameOver = !previousEndState && !!state.endState;
    if (isGameOver) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 1200);
    }
  }, [previousEndState, state.endState])

  function closeModal() {
    setIsModalOpen(false);
  }

  const {
    activeRow,
    endState,

    board, 
    boardState,
    scores,
    
    keyboard,
    submissionError,
    submittedWords,
  } = state;

  return (
    <div>
      <Container>
        <Toast error={submissionError} />
        <GameBoard
          activeRow={activeRow}

          board={board}
          boardState={boardState}
          scores={scores}

          submissionError={submissionError}
          submittedWords={submittedWords}
        />
        <Keyboard
          keyboard={keyboard}
          onClick={handleEvent}
        />
      </Container>
      <Modal
        content={endState}
        isOpen={isModalOpen}
        close={closeModal}
      />
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background: #121213;
  height: 100vh;
`;

export default App;
