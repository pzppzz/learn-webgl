import { useCallback, useEffect, useRef } from "react";

type Watcher<T> = (target: T) => void;

export function useWatcher<T = unknown>(target: T) {
  const cacheRef = useRef<T>(target);
  const watchRef = useRef<Watcher<T> | null>(null);

  const attach = useCallback((watcher: Watcher<T>) => {
    watchRef.current = watcher;
    watcher(cacheRef.current);
  }, []);

  const detach = useCallback(() => {
    watchRef.current = null;
  }, []);

  useEffect(() => {
    cacheRef.current = target;
    if (watchRef.current) {
      watchRef.current(target);
    }
  }, [target]);

  return {
    attach,
    detach,
  };
}
