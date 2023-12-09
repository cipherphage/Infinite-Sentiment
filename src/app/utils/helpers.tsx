import { text } from "stream/consumers";
import { defaultSentiment } from "./defaults";

export const getRawTextArrayFromString = (s: string): string[] => {
  const rawArray = s.split(
    /[.!'"?](?=[\s]+[\n]+[\s]+)/g
  );
  return rawArray.filter((el) => {
    if (el) {
      const e = el.trim();
      if (e) {
        return '"' + e + '"';
      }
    }
  });
};

export const getPassagesArrayFromRawTextArray = (sArray: string[], a: string): TextPassage[] => {
  return sArray.map((el) => {
    return {
      passage: el,
      author: a,
      sentiment: defaultSentiment
    };
  });
};

export const updateSentimentOfPassage = (textOutput: Sentiment, passage: TextPassage): TextPassage => {
  const s = passage.sentiment;
  const c = Math.floor(textOutput.score * 100 * 2.54999);
  return {
    ...passage, 
    sentiment: {
      label: textOutput.label,
      score: textOutput.score,
      color: c
    }
  };
};

// export const updatePassagesArray = (textArray: Sentiment[], passageArray: TextPassage[]) => {
//     return passageArray.map((el, i) => {
//       const s = el.sentiment;
//       const t = textArray[i];
//       s.label = t.label;
//       s.score = t.score;
//       s.color = Math.floor(t.score * 100 * 2.54999);
//     });
// };

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