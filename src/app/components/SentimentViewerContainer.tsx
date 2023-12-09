import { useCallback, useEffect, useRef, useState } from "react";
import Squares from "./Squares/Squares";
import { updateSentimentOfPassage } from "../utils/helpers";
import "./Squares/squareStyles.css";
import { defaultPassage } from "../utils/defaults";

interface SentimentViewerProps {
    textArray: string[];
    passageArray: TextPassage[];
    isLoading: boolean;
}

export default function SentimentViewer({ textArray, passageArray, isLoading }: SentimentViewerProps) {
  const [index, setIndex] = useState(0);
  const [updatedPassage, setUpdatedPassage] = useState<TextPassage>(defaultPassage);
  const [updatedPassageArray, setUpdatedPassageArray] = useState<TextPassage[]>([]);
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
    if (!isLoading) {
      const newPA = [...updatedPassageArray, updatedPassage];
      setUpdatedPassageArray(newPA);
    }
  }, [updatedPassage]);

  const classify = useCallback((t: string, i: number) => {
    if (worker.current) {
      worker.current.postMessage({ t, i });
    }
  }, []);

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
    </div>
    <div className="square-grid">
      <Squares updatedPassageArray={updatedPassageArray} />
    </div>
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