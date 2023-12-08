import { defaultSentiment } from "./defaults";

export const getRawTextArrayFromString = (s: string): string[] => {
  return s.split(
    /[.!'"?](?=[\s]+[\n]+[\s]+)/g
  );
};

export const getPassagesArrayFromRawTextArray = (sArray: string[], a: string): TextPassage[] => {
  return sArray.map((el) => {
    return {
      passage: el.trim(),
      author: a,
      sentiment: defaultSentiment
    };
  });
};

export const typerPauseRandom = async () => {
  // Use random millisecond and power distribution (thus skewing to smaller pauses)
  // to simulate actual typing .
  const randomMS = Math.pow(Math.floor(Math.random() * 20), 2);
  const timeout = new Promise((resolve) => setTimeout(resolve, randomMS));
  return timeout;
};

export const getRandomArrayElement = (a: [] | TextPassage[]) => {
  const randNum = Math.floor(Math.random() * a.length);
  return a[randNum];
}