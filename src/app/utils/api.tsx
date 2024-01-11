import { getPassagesArrayFromRawTextArray, getRawTextArrayFromString } from "./helpers";

export const yourFilePath = "yourgreatliterature.txt";
export const yourAuthor = "- Your Great Author";

// Fetch a string from a text file.
const fetchStringFromTextFile = async (file: string) => {
  const res = await fetch(file);
  const rest = await res.text();
  return rest;
}

// Fetch passages from a string from a text file.
// Put your text files in the public folder. Specify the path like so:
// const filePath = "yourgreatliterature.txt";
export const fetchPassages = async (file: string, author: string) => {
  const j = await fetchStringFromTextFile(file);
  const rawTextArray = getRawTextArrayFromString(j);
  const passagesArray: TextPassage[] = getPassagesArrayFromRawTextArray(
    rawTextArray, author);

  return {text: rawTextArray, passages: passagesArray};
}

// export const testUrl = "https://httpbin.org/ip";

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