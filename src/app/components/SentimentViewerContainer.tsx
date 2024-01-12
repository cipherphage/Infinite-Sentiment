import React, { useCallback, useEffect, useRef, useState } from "react";

import Squares from "./Squares/Squares";
import { getIntlSegmentIterator, getSortedArray, updateSentimentOfPassage } from "../utils/helpers";
import "./Squares/squareStyles.css";
import { defaultPassage, defaultSentiment } from "../utils/defaults";

import Info from "./Info/Info";
import Button from "./Button/Button";

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
  const [passageIndex, setPassageIndex] = useState(0);
  const [updatedPassage, setUpdatedPassage] = useState<TextPassage>(defaultPassage);
  const [updatedPassageArray, setUpdatedPassageArray] = useState<TextPassage[]>([]);
  const [resultSort, setResultSort] = useState<ResultSort>({ sort: 'index', reverse: false });
  // Keep track of the classification model name and loading status.
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState('');
  const [modelName, setModelName] = useState('');
  const [granularity, setGranularity] = useState<Intl.SegmenterOptions["granularity"]>('sentence');

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
          let totalSegments = e.data.totalSegments;

          if (e.data.output.length > 0) {
            const currentP = {
              index: e.data.pIndex,
              segmentIndex: e.data.totalSegments,
              passage: e.data.t[e.data.cIndex].segment,
              author: passageArray[0].author,
              sentiment: defaultSentiment
            };
            const newP = updateSentimentOfPassage(e.data.output[0], currentP);
            setUpdatedPassage(newP);
            totalSegments++;
          }

          if (e.data.cIndex < e.data.t.length-1){
            classify(e.data.t, e.data.pIndex, e.data.cIndex+1, totalSegments);
          } else {
            const pIndex = (textArray.length !== e.data.pIndex+1) ? e.data.pIndex+1 : -1;

            if (pIndex >= 0) {
              const newIter = getIntlSegmentIterator(textArray[pIndex], granularity);
              const newSegments = [...newIter];

              setPassageIndex(pIndex);
              classify(newSegments, pIndex, 0, totalSegments);
            } else {
              setDone(true);
            }
          }
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    if (!isLoading) {
      const newIter = getIntlSegmentIterator(textArray[0], granularity);
      const newSegments = [...newIter];

      classify(newSegments, 0, 0, 0);
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

  const classify = useCallback((t: Intl.SegmentData[], pIndex: number, cIndex: number, totalSegments: number) => {
    if (worker.current) {
      worker.current.postMessage({ t, pIndex, cIndex, totalSegments});
    }
  }, []);

  const onClickChangeGranularity = () => {
    const g = granularity === 'word' ? 'sentence' : 'word';
    setGranularity(g);
  }

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

  return <React.Fragment>
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
        <Info
          passageIndexPlusOne={passageIndex+1}
          textArrayLength={textArray.length}
          updatedPassageArrayLength={updatedPassageArray.length}
          granularity={granularity}
          done={done}
          ready={ready} />
        <br/>
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
            <Button
              onClickCallback={onClickChangeGranularity}
              buttonText={`Analyze by ${granularity === 'word' ? 'sentence' : 'word'}`}
              buttonSymbol="greaterthan" />
            <Button
              onClickCallback={onClickSortByScore}
              buttonText="Sort by sentiment score"
              buttonSymbol="greaterthan" />
            <Button
              onClickCallback={onClickSortByPassageLength}
              buttonText="Sort by passage length"
              buttonSymbol="greaterthan" />
            <Button
              onClickCallback={onClickSortByIndex}
              buttonText="Sort by text order"
              buttonSymbol="greaterthan" />
            <Button
              onClickCallback={onClickReverseSort}
              buttonText={`Sort ${' '} ${resultSort.reverse ? 'ascending' : 'descending'}`}
              buttonSymbol="greaterthan" />
        </div>
        <br/>
    </div>
    <Squares updatedPassage={updatedPassage} updatedPassageArray={updatedPassageArray} />
    <Info
      passageIndexPlusOne={passageIndex+1}
      textArrayLength={textArray.length}
      updatedPassageArrayLength={updatedPassageArray.length}
      granularity={granularity}
      done={done}
      ready={ready} />
  </React.Fragment>;
};