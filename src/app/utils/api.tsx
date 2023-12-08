import { defaultSentiment } from "./defaults";
import { getPassagesArrayFromRawTextArray, getRawTextArrayFromString } from "./helpers";

// export const testUrl = "https://httpbin.org/ip";
export const ijFilePath = "ij.txt";

// Fetch json from a URL.
// const fetchJSON = async (url: string) => {
//   const res = await fetch(url);
//   const resj = await res.json();
//   return resj;
// }

// Fetch client IP address for testing purposes.
// export const fetchTheIp = async (url: string) => {
//   const j = await fetchJSON(url);
//   return j?.origin;
// };

const fetchStringFromTextFile = async (file: string) => {
  const res = await fetch(file);
  const rest = await res.text();
  return rest;
}

export const fetchIJQuote = async (file: string) => {
  const j = await fetchStringFromTextFile(file);
  const rawTextArray = getRawTextArrayFromString(j);
  const passagesArray: TextPassage[] = getPassagesArrayFromRawTextArray(
    rawTextArray,'- David Foster Wallace, Infinite Jest');

  return passagesArray;
};