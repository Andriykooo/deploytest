export const _debounce = (delay = 400) => {
  let timer = null;

  return (cb) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(cb, delay);
  };
};
