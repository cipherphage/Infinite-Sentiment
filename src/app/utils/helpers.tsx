export const typerPauseRandom = async () => {
  // Use random millisecond and power distribution (thus skewing to smaller pauses)
  // to simulate actual typing .
  const randomMS = Math.pow(Math.floor(Math.random() * 20), 2);
  const timeout = new Promise((resolve) => setTimeout(resolve, randomMS));
  return timeout;
};