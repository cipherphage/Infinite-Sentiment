export const defaultTitle: string = 'Infinite Sentiment';

export const defaultLetter: Letter = {
  'i': -1,
  'letter': ''
};

export const defaultSentiment: Sentiment = {
  label: '',
  score: -1,
  color: -1
};

export const defaultPassage: TextPassage = {
  passage: '',
  author: '',
  index: -1,
  segmentIndex: -1,
  sentiment: defaultSentiment
};

export const defaultGridSize = {
  min: 0.5,
  max: 100,
  styleString1: 'repeat(auto-fit, minmax(',
  styleString2: '%,',
  styleString3: '%))'
}