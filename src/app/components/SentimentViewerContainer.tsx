import { useCallback, useEffect, useRef, useState } from "react";
import Squares from "./Squares/Squares";
import { getSortedArray, updateSentimentOfPassage } from "../utils/helpers";
import "./Squares/squareStyles.css";
import { defaultPassage } from "../utils/defaults";

interface SentimentViewerProps {
    textArray: string[];
    passageArray: TextPassage[];
    isLoading: boolean;
}

type ResultSort = {
    sort: string;
    reverse: boolean;
}

export default function SentimentViewer({ textArray, passageArray, isLoading }: SentimentViewerProps) {
  const [index, setIndex] = useState(0);
  const [updatedPassage, setUpdatedPassage] = useState<TextPassage>(defaultPassage);
  const [updatedPassageArray, setUpdatedPassageArray] = useState<TextPassage[]>([]);
  const [resultSort, setResultSort] = useState<ResultSort>({ sort: 'index', reverse: false });
  // Keep track of the classification model name and loading status.
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState('');
  const [modelName, setModelName] = useState('');

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../TransformerWorker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e:any) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          setModelName(e.data.name);
          break;
        case 'progress':
          setProgress(e.data.progress);
          setFile(e.data.file);
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          const newP = updateSentimentOfPassage(e.data.output[0], passageArray[e.data.index]);
          setUpdatedPassage(newP);
          const index = (passageArray.length !== e.data.index+1) ? e.data.index+1 : -1;
          if (index >= 0) {
            setIndex(index);
            classify(textArray[index],index);
          } else {
            setDone(true);
          }
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    if (!isLoading) {
      classify(textArray[0], 0);
    }

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);

  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && ready) {
      const newPA = [...updatedPassageArray, updatedPassage];
      setUpdatedPassageArray(newPA);
    }
  }, [updatedPassage]);

  const classify = useCallback((t: string, i: number) => {
    if (worker.current) {
      worker.current.postMessage({ t, i });
    }
  }, []);

  const onClickSortByScore = () => {
    let s = resultSort.sort;

    if (resultSort.sort !== 'score') {
        setResultSort({ ...resultSort, sort: 'score' });
        s = 'score';
    }

    const reversedArray = getSortedArray(s, resultSort.reverse, updatedPassageArray);
    setUpdatedPassageArray(reversedArray);
  };

  const onClickSortByPassageLength = () => {
    let s = resultSort.sort;

    if (s !== 'passageLength') {
        setResultSort({ ...resultSort, sort: 'passageLength' });
        s = 'passageLength';
    }

    const reversedArray = getSortedArray(s, resultSort.reverse, updatedPassageArray);
    setUpdatedPassageArray(reversedArray);
  };

  const onClickSortByIndex = () => {
    let s = resultSort.sort;

    if (s !== 'index') {
        setResultSort({ ...resultSort, sort: 'index' });
        s = 'index';
    }

    const reversedArray = getSortedArray(s, resultSort.reverse, updatedPassageArray);
    setUpdatedPassageArray(reversedArray);
  };

  const onClickReverseSort = () => {
    let r = resultSort.reverse;

    if (!r) {
        setResultSort({ ...resultSort, reverse: true });
        r = true;
    } else {
        setResultSort({ ...resultSort, reverse: false });
        r = false;
    }

    if (updatedPassageArray.length) {
        const reversedArray = getSortedArray(resultSort.sort, r, updatedPassageArray);
        setUpdatedPassageArray(reversedArray);
    }
  };

  return <>
    <div>
        <h4>
            { (!ready) && 
            `Loading the ${modelName} model...`}
        </h4>
        <br/>
        { (progress < 100 ) && 
            <h4>
                Progress on file {file}: {progress}%
            </h4>
        }
        <br/>
        { (!done && ready) && 
            <h4>
                Analyzing passage #{index+1} of { passageArray.length }
                <span className="animate-ping">...</span>
            </h4>
        }
        <br/>
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
            <button
            className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={onClickSortByScore}
            >
                <h4 className={`mb-3 text-1xl`}>
                    {' '}Sort by sentiment score{' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        &gt;
                    </span>
                </h4>
                {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
            </button>
            <button
            className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={onClickSortByPassageLength}
            >
                <h4 className={`mb-3 text-1xl`}>
                    {' '}Sort by passage length{' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        &gt;
                    </span>
                </h4>
                {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
            </button>
            <button
            className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={onClickSortByIndex}
            >
                <h4 className={`mb-3 text-1xl`}>
                    {' '}Sort by text order{' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        &gt;
                    </span>
                </h4>
                {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
            </button>
            <button
            className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={onClickReverseSort}
            >
                <h4 className={`mb-3 text-1xl`}>
                    {' '}Sort {' '} {resultSort.reverse ? 'ascending' : 'descending'} {' '}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        &gt;
                    </span>
                </h4>
                {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
            </button>
        </div>
        <br/>
    </div>
    <Squares updatedPassage={updatedPassage} updatedPassageArray={updatedPassageArray} />
    <div>
        <br/>
        { (!done && ready) && 
            <h4>
                Analyzing passage #{index+1} of { passageArray.length }
                <span className="animate-ping">...</span>
            </h4>
        }
        <br/>
    </div>
  </>;
};