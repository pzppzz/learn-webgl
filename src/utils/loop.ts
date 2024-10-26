export function loop(cb: (dt: number) => void) {
  let animationId: number = -1;
  let lastTimestamp = 0;

  const func = (timestamp: number) => {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }
    animationId = window.requestAnimationFrame(func);
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    cb(dt);
  };

  func(lastTimestamp);
  return () => {
    window.cancelAnimationFrame(animationId);
  };
}
