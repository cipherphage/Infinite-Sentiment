'use client'

import { useEffect, useState } from "react";
import Typer from "./components/TyperContainer";
import { fetchIJQuote, ijFilePath } from "./utils/api";
import SentimentContainer from "./components/SentimentContainer";
import { getRandomArrayElement } from "./utils/helpers";

export default function Home() {
    // Title and nav buttons state.
    const [title, setTitle] = useState('Infinite Sentiment');
    const [typingStatus, setTypingStatus] = useState(true);
    // Quotes (AKA passages) state.
    const [quote, setQuote] = useState('');
    const [quoteArray, setQuoteArray] = useState<TextPassage[]>([]);
    const [author, setAuthor] = useState('');
    const [qIsLoading, setQIsLoading] = useState(true);
    const [qMessage, setQMessage] = useState(
        `Loading Infinite Jest Quote from ${ijFilePath} ...`);

    // Load text on first mount of component.
    useEffect(() => {
        loadQ();
    }, []);

    const loadQ = async () => {
        // TODO: handle http error and other edge cases.
        const q = await fetchIJQuote(ijFilePath);
        const randQ = getRandomArrayElement(q);
        setQuote(randQ.passage);
        setAuthor(randQ.author);
        setQuoteArray(q);
        setQMessage('');
        setQIsLoading(false);
    }

    // Button actions.
    const onClickTypingStatus = () => {
        const newStatus = !typingStatus;
        setTypingStatus(newStatus);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono">
            
                <Typer word={title} isLoading={false} message="" subtitle="" classes="font-semibold" typingStatus={true}/>

                <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full ">
                    <button
                    className="flex-grow rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    onClick={onClickTypingStatus}
                    >
                        <h4 className={`mb-3 text-1xl`}>
                            <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
                                &lt;
                            </span>
                            {' '}Get new passage{' '}
                            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                &gt;
                            </span>
                        </h4>
                        {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
                    </button>
                    <button
                    className="flex-grow rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    onClick={onClickTypingStatus}
                    >
                        <h4 className={`mb-3 text-1xl`}>
                            <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
                                {typingStatus ? '-' : '+'}
                            </span>
                            {' '}Turn typing {typingStatus ? 'OFF' : 'ON'}{' '}
                            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                {typingStatus ? '-' : '+'}
                            </span>
                        </h4>
                        {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
                    </button>
                </div>

                <Typer word={quote} isLoading={qIsLoading} message={qMessage} subtitle={author} classes="" typingStatus={typingStatus}/>
                <br/>
                <SentimentContainer text={quote} isLoading={qIsLoading} />
            </div>
        </main>
    )
}
