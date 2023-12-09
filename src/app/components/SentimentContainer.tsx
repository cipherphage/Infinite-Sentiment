import { useCallback, useEffect, useRef, useState } from "react";

interface SentimentContProps {
  text: string;
  isLoading: boolean;
}

export default function Sentiment({ text, isLoading }: SentimentContProps) {
  const [label, setLabel] = useState('');
  const [score, setScore] = useState(0);
  // Keep track of the classification model name and loading status.
  const [ready, setReady] = useState(false);
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
          setReady(true);
          setLabel(e.data.output[0].label);
          setScore(e.data.output[0].score);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    if (!isLoading) {
      // Perform state reset before calling classifier.
      setLabel('');
      setScore(0);
      setReady(false);

      classify(text);
    }

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);

  }, [isLoading, text]);

  const classify = useCallback((t: string) => {
    if (worker.current) {
      worker.current.postMessage({ t });
    }
  }, []);

  return <div>
      <h4>
        { (!ready || !label) ? 
        <br/> : 
        `Label: ${label}` }
      </h4>
      <h4>
        { (!ready || !score) ? 
        `Loading the ${modelName} model...` :
        `Score: ${ (score * 100).toFixed(2) + "%"}` }
      </h4>
      <br/>
      { (progress < 100 ) && 
        <h4>
          Progress on file {file}: {progress}%
        </h4>
      }
    </div>;
};