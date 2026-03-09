/**
 * @param {number} ms
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
};

export { sleep };
