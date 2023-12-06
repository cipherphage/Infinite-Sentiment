'use client'

import { useEffect, useState } from "react";
import Typer from "./components/TyperContainer";
import { fetchIJQuote, testUrl, ijFilePath } from "./utils/api";
import SentimentContainer from "./components/SentimentContainer";

export default function Home() {
    const [title, setTitle] = useState('Infinite Sentiment');

    const [quote, setQuote] = useState('');
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
        setQuote(q.q);
        setAuthor(q.a);
        setQMessage('');
        setQIsLoading(false);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono">
                <Typer key="typer1" word={title} isLoading={false} message="" subtitle="" />
                <br/>
                <Typer key="typer2" word={quote} isLoading={qIsLoading} message={qMessage} subtitle={author} />
                <br/>
                <SentimentContainer text={quote} isLoading={qIsLoading} />
            </div>
        </main>
    )
}
