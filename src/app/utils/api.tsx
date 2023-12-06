export const testUrl = "https://httpbin.org/ip";
export const ijFilePath = "ij.txt";

const fetchJSON = async (url: string) => {
  const res = await fetch(url);
  const resj = await res.json();
  return resj;
}

// Fetch client IP address for testing purposes.
// export const fetchTheIp = async (url: string) => {
//   const j = await fetchJSON(url);
//   return j?.origin;
// };

const fetchRandomTextFromFile = async (file: string) => {
  const res = await fetch(file);
  const rest = (await res.text()).split(
    /[.!'"?](?=[\s]+[\n]+[\s]+)/g
  ).map(el => el.trim());
  const randNum = Math.floor(Math.random() * rest.length);
  return rest[randNum];
}

export const fetchIJQuote = async (file: string) => {
  const j = await fetchRandomTextFromFile(file);
  return { 'q': '"'+j+'"', 'a': '- David Foster Wallace, Infinite Jest' };
};