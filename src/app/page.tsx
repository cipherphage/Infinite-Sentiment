'use client'

import { useEffect, useState } from "react";
import Passage from "./components/PassageContainer";
import Typer from "react-natural-typing-effect";
import { fetchIJQuote, ijFilePath } from "./utils/api";
import Sentiment from "./components/SentimentContainer";
import { getRandomArrayElement } from "./utils/helpers";
import { defaultTitle } from "./utils/defaults";
import SentimentViewer from "./components/SentimentViewerContainer";

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
        `Loading Infinite Jest Quote from ${ijFilePath} ...`);

    // Load text on first mount of component.
    useEffect(() => {
        loadP();
    }, []);

    const loadP = async () => {
        // TODO: handle http error and other edge cases.
        const {text, passages} = await fetchIJQuote(ijFilePath);
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
                    <button
                    className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    onClick={onClickGetPassage}
                    >
                        <h4 className={`mb-3 text-1xl`}>
                            <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
                                &lt;
                            </span>
                            {' '}Get new random passage{' '}
                            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                &gt;
                            </span>
                        </h4>
                        {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
                    </button>
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
