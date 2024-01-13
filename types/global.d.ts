export {}

declare global {
  type Sentiment = {
    label: string
    score: number
    color: number
  }

  type TextPassage = {
    index: number
    segmentIndex: number
    passage: string
    author: string
    sentiment: Sentiment
    transformersOutput: Sentiment[]
  }

  type Letter = {
    i: number
    letter: string
  }

  type TransformersMessage = {
    data: {
      status: string
      output: Sentiment[]
      isSegmented: boolean
      segments?: Intl.SegmentData[]
      textPassage?: TextPassage
      pIndex: number
      cIndex: number
      modelName: string
      totalSegments: number
      name?: string
      progress?: number
      file?: string
    }
  }
}