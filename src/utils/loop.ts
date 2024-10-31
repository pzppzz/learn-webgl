interface LoopConfig {
  interval?: number;
  duration?: number;
}

export function loop(cb: (dt: number) => void, config: LoopConfig = {}) {
  const { interval = 1000 / 60, duration = Number.POSITIVE_INFINITY } = config;
  let requestId = -1;
  let lastTime = 0;
  let accTime = 0;
  let durationTime = 0;

  const cancel = () => {
    if (requestId !== -1) {
      window.cancelAnimationFrame(requestId);
      requestId = -1;
    }
  };

  const tick = (currentTime = performance.now()) => {
    if (currentTime > lastTime) {
      accTime += currentTime - lastTime;
      durationTime += currentTime - lastTime;
      while (accTime >= interval) {
        accTime -= interval;
        cb(interval);
      }
      lastTime = currentTime;
      if (durationTime >= duration) {
        return cancel();
      }
    }
    lastTime = currentTime;
    requestId = window.requestAnimationFrame(tick);
  };

  lastTime = performance.now();
  requestId = window.requestAnimationFrame(tick);

  return cancel;
}
