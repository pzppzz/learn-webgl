export function loop(cb: (dt: number) => void) {
  let animationId: number = -1;
  const func = (dt: number) => {
    animationId = window.requestAnimationFrame(func);
    cb(dt);
  };
  func(0);
  return () => {
    window.cancelAnimationFrame(animationId);
  };
}
