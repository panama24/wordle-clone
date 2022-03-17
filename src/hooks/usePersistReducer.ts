import {
  useCallback,
  useReducer,
} from "react";
import { useLocalStorage } from "react-use";
import { initialState, reducer } from "../reducers";

const LOCAL_STORAGE_KEY = 'enolc-eldrow';

export function usePersistReducer() {
  const [savedState, setSavedState] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    initialState,
  );

  const reducerWithLocalStorage = useCallback((state, action) => {
    const newState = reducer(state, action);
    
    setSavedState(newState);

    return newState;
  }, [setSavedState]);

  return useReducer(reducerWithLocalStorage, savedState);
}