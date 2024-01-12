'use client'

import { useEffect, useState } from "react";
import Passage from "./components/PassageContainer";
import Typer from "react-natural-typing-effect";
import { fetchPassages, yourAuthor, yourFilePath } from "./utils/api";
import Sentiment from "./components/SentimentContainer";
import { getRandomArrayElement } from "./utils/helpers";
import { defaultTitle } from "./utils/defaults";
import SentimentViewer from "./components/SentimentViewerContainer";
import Button from "./components/Button/Button";

export default function Home() {
  // Title and nav buttons state.
  const [title, setTitle] = useState(defaultTitle);
  // Quotes (AKA passages) state.
  const [passage, setPassage] = useState('');
  const [passageArray, setPassageArray] = useState<TextPassage[]>([]);
  const [textArray, setTextArray] = useState<string[]>([]);
  const [author, setAuthor] = useState('');
  const [pIsLoading, setPIsLoading] = useState(true);
  const [pMessage, setPMessage] = useState(
    `Loading passages from ${yourAuthor}...`);

  // Load text on first mount of component.
  useEffect(() => {
    loadP();
  }, []);

  const loadP = async () => {
    // TODO: handle http error and other edge cases.
    const {text, passages} = await fetchPassages(yourFilePath, yourAuthor);
    const randP = getRandomArrayElement(passages);
    setPassage(randP.passage);
    setAuthor(randP.author);
    setPassageArray(passages);
    setTextArray(text);
    setPMessage('');
    setPIsLoading(false);
  };

  // Button actions.
  const onClickGetPassage = () => {
    const randP = getRandomArrayElement(passageArray);
    setPassage(randP.passage);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono">
      
        <Typer text={title} customTypingOptions={{mode:"typewriter"}} typerContainerClass="font-semibold" />

        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
          <Button
            onClickCallback={onClickGetPassage}
            buttonText="Get new random passage"
            buttonSymbol="both" />
        </div>
        
        <Passage word={passage} isLoading={pIsLoading} message={pMessage} subtitle={author} classes="" />

        <br/>
        <Sentiment text={passage} isLoading={pIsLoading} />
        <br/>
        <SentimentViewer textArray={textArray} passageArray={passageArray} isLoading={pIsLoading} />

      </div>
    </main>
  )
}
