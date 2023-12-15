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
  return sArray.map((el, i) => {
    return {
      index: i,
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

export const getRandomArrayElement = (a: [] | TextPassage[]) => {
  const randNum = Math.floor(Math.random() * a.length);
  return a[randNum];
}

const sortByScore = (r: boolean, a: [] | TextPassage[]): [] | TextPassage[] => {
  if (r) {
    return a.toSorted((i, j) => {
      const iScore = i.sentiment.label === 'POSITIVE' ? i.sentiment.score : (i.sentiment.score * -1);
      const jScore = j.sentiment.label === 'POSITIVE' ? j.sentiment.score : (j.sentiment.score * -1);
      return jScore - iScore;
    });
  } else {
    return a.toSorted((i, j) => {
      const iScore = i.sentiment.label === 'POSITIVE' ? i.sentiment.score : (i.sentiment.score * -1);
      const jScore = j.sentiment.label === 'POSITIVE' ? j.sentiment.score : (j.sentiment.score * -1);
      return iScore - jScore;
    });
  }
};

const sortByPassageLength = (r: boolean, a: [] | TextPassage[]): [] | TextPassage[] => {
  if (r) {
    return a.toSorted((i, j) => j.passage.length - i.passage.length);
  } else {
    return a.toSorted((i, j) => i.passage.length - j.passage.length);
  }
};

const sortByIndex = (r: boolean, a: [] | TextPassage[]): [] | TextPassage[] => {
  if (r) {
    return a.toSorted((i, j) => j.index - i.index);
  } else {
    return a.toSorted((i, j) => i.index - j.index);
  }
}

export const getSortedArray = (s: string, r: boolean, a: [] | TextPassage[]): [] | TextPassage[] => {
  let sortedA: [] | TextPassage[] = [];

  if (s === 'score') {
    sortedA = sortByScore(r, a);
  } else if (s === 'passageLength') {
    sortedA = sortByPassageLength(r, a);
  } else if (s === 'index') {
    sortedA = sortByIndex(r, a);
  }

  return sortedA;
};