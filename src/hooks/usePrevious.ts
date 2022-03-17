import { useEffect, useRef  } from "react";

type Ref = string | number | null;
export function usePrevious(previous: Ref) {
  const ref = useRef<Ref>(previous);

  useEffect(() => {
    if (ref.current) {
      ref.current = previous;
    }
  });

  return ref.current;
}