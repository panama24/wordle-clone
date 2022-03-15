import { useEffect, useRef  } from "react";

export function usePrevious(previous: string | null) {
  const ref = useRef<null | string>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current = previous;
    }
  });

  return ref.current;
}