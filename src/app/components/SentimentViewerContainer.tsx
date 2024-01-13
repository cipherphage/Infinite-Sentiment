import React, { useCallback, useEffect, useRef, useState } from "react";

import Squares from "./Squares/Squares";
import { getIntlSegmentArray, getSortedArray, updateSentimentOfPassage } from "../utils/helpers";
import "./Squares/squareStyles.css";
import { defaultPassage, defaultSentiment } from "../utils/defaults";

import Info from "./Info/Info";
import Button from "./Button/Button";

interface SentimentViewerProps {
    passageArray: TextPassage[];
    isLoading: boolean;
}

type ResultSort = {
    sort: string;
    reverse: boolean;
}

export default function SentimentViewer({ passageArray, isLoading }: SentimentViewerProps) {
  const [passageIndex, setPassageIndex] = useState(0);
  const [updatedPassage, setUpdatedPassage] = useState<TextPassage>(defaultPassage);
  const [updatedPassageArray, setUpdatedPassageArray] = useState<TextPassage[]>([]);
  const [resultSort, setResultSort] = useState<ResultSort>({ sort: 'index', reverse: false });
  // Keep track of the classification model name and loading status.
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(0);
  const [file, setFile] = useState<string | undefined>('');
  const [modelName, setModelName] = useState<string | undefined>('');
  const [granularity, setGranularity] = useState<Intl.SegmenterOptions["granularity"]>('sentence');
  const [isPassageGranularity, setIsPassageGranularity] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastCompleteMessage, setLastCompleteMessage] = useState<TransformersMessage>();

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../TransformerWorker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
  const onMessageReceived = (e: TransformersMessage) => {
    switch (e.data.status) {
      case 'initiate':
        setReady(false);
        setModelName(e.data?.name);
        break;
      case 'progress':
        setProgress(e.data?.progress);
        setFile(e.data?.file);
      case 'ready':
        setReady(true);
        break;
      case 'complete':
        setLastCompleteMessage(e);
        break;
    }
  };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    if (!isLoading) {
      const newSegments = isPassageGranularity ?
        passageArray[0] :
        getIntlSegmentArray(passageArray[0].passage, granularity);

      classify(!isPassageGranularity, newSegments, 0, 0, 0);
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

  useEffect(() => {
    if (!isPaused && lastCompleteMessage) {
      // TODO put some of this logic into helper functions for unit testing.
      let totalSegments = lastCompleteMessage.data.totalSegments;

      if (lastCompleteMessage.data.output.length > 0) {
        let currentP;

        if (lastCompleteMessage.data.textPassage) {
          currentP = {
            ...lastCompleteMessage.data.textPassage,
            passage: lastCompleteMessage.data.textPassage.passage
          }
        } else if (lastCompleteMessage.data.segments) {
          currentP = {
            index: lastCompleteMessage.data.pIndex,
            segmentIndex: totalSegments,
            passage: lastCompleteMessage.data.segments[lastCompleteMessage.data.cIndex].segment,
            author: passageArray[lastCompleteMessage.data.pIndex].author,
            transformersOutput: lastCompleteMessage.data.output,
            sentiment: defaultSentiment
          };
        } else {
          currentP = passageArray[lastCompleteMessage.data.pIndex];
        }

        const newP = updateSentimentOfPassage(lastCompleteMessage.data.output[0], currentP);
        setUpdatedPassage(newP);
        totalSegments++;
      }

      if (lastCompleteMessage.data.segments &&
            (lastCompleteMessage.data.cIndex < lastCompleteMessage.data.segments.length-1)){
        classify(true,
          lastCompleteMessage.data.segments,
          lastCompleteMessage.data.pIndex,
          lastCompleteMessage.data.cIndex+1,
          totalSegments);
      } else {
        const pIndex = (passageArray.length !== lastCompleteMessage.data.pIndex+1) ?
          lastCompleteMessage.data.pIndex+1 :
          -1;

        if (pIndex >= 0) {
          const newSegments = isPassageGranularity ?
            passageArray[pIndex] :
            getIntlSegmentArray(passageArray[pIndex].passage, granularity);

          setPassageIndex(pIndex);
          classify(!isPassageGranularity, newSegments, pIndex, 0, totalSegments);
        } else {
          setDone(true);
        }
      }
    }
  }, [isPaused, lastCompleteMessage]);

  const classify = useCallback((
      isSegmented: boolean,
      text: Intl.SegmentData[] | TextPassage,
      pIndex: number,
      cIndex: number,
      totalSegments: number
    ) => {
    if (worker.current) {
      let segments = isSegmented ? text : undefined;
      let textPassage = isSegmented ? undefined : text;
      worker.current.postMessage({ isSegmented, segments, textPassage, pIndex, cIndex, totalSegments });
    }
  }, []);

  const onClickPause = () => {
    setIsPaused(!isPaused);
  };

  const onClickChangeGranularity = (
    e: React.MouseEvent, g: Intl.SegmenterOptions["granularity"] | 'passage'
  ) => {
    if (g === 'passage') {
      setIsPassageGranularity(true);
      setGranularity(undefined);
    } else {
      setIsPassageGranularity(false);
      setGranularity(g);
    }
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
        { (progress && (progress < 100)) && 
            <h4>
                Progress on file {file}: {progress}%
            </h4>
        }
        <br/>
        <Info
          passageIndexPlusOne={passageIndex+1}
          textArrayLength={passageArray.length}
          updatedPassageArrayLength={updatedPassageArray.length}
          granularity={granularity}
          done={done}
          ready={ready} />
        <br/>
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
          <Button
              onClickCallback={onClickPause}
              buttonText={ isPaused ? "Unpause analysis" : "Pause analysis"}
              buttonSymbol="greaterthan" />
            <Button
              onClickCallback={(e) => onClickChangeGranularity(e, 'word')}
              buttonText="Analyze by word"
              buttonSymbol="greaterthan"
              disabled={ granularity === 'word' ? true : false } />
            <Button
              onClickCallback={(e) => onClickChangeGranularity(e, 'sentence')}
              buttonText="Analyze by sentence"
              buttonSymbol="greaterthan"
              disabled={ granularity === 'sentence' ? true : false } />
            <Button
              onClickCallback={(e) => onClickChangeGranularity(e, 'passage')}
              buttonText="Analyze by passage"
              buttonSymbol="greaterthan"
              disabled={ isPassageGranularity } />
        </div>
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
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
      textArrayLength={passageArray.length}
      updatedPassageArrayLength={updatedPassageArray.length}
      granularity={granularity}
      done={done}
      ready={ready} />
  </React.Fragment>;
};