export {}

declare global {
  type Sentiment = {
    label: string
    score: number
    color: number
  }

  type TextPassage = {
    index: number
    passage: string
    author: string
    sentiment: Sentiment
  }

  type Letter = {
    i: number
    letter: string
  }
}