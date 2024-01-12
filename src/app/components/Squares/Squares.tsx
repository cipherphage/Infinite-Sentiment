import React, { useEffect, useState } from "react";

import Passage from "../PassageContainer";

interface SquareProps {
  updatedPassage: TextPassage;
  updatedPassageArray: TextPassage[];
}

export default function Squares({ updatedPassage, updatedPassageArray }: SquareProps) {
  const [selectedNode, setSelectedNode] = useState<Element | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<TextPassage | null>(null);

  useEffect(() => {
    if ((!selectedPassage || !selectedNode) && (updatedPassageArray.length)) {
      const up = updatedPassageArray[updatedPassageArray.length-1];
      setSelectedNode(getSquareByIndex(up.segmentIndex));
      setSelectedPassage(up);
    }
  }, [updatedPassageArray]);

  useEffect(() => {
    if (selectedNode) {
      selectedNode.classList.add('square-selected-border');
    }
  }, [selectedNode]);

  const onClickSquare = (e: React.MouseEvent, passage: TextPassage) => {
    if (selectedNode) {
      selectedNode.classList.remove('square-selected-border');
    }
    
    if ((selectedPassage?.passage === passage.passage) &&
      (selectedPassage?.segmentIndex === passage.segmentIndex)) {
      setSelectedNode(null);
      setSelectedPassage(null);
    } else {
      setSelectedNode(e.currentTarget);
      setSelectedPassage(passage);
    }
  };

  const onNextClick = (e: React.MouseEvent, direction: boolean) => {
    const lastArrayIndex = updatedPassageArray.length-1;
    const currentIndex = selectedPassage ? selectedPassage.segmentIndex : lastArrayIndex;
    let nextIndex = direction ? currentIndex+1 : currentIndex-1;

    if (nextIndex > lastArrayIndex) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = lastArrayIndex;
    }

    if (selectedNode) {
      selectedNode.classList.remove('square-selected-border');
    }
    setSelectedNode(getSquareByIndex(nextIndex));
    setSelectedPassage(updatedPassageArray[nextIndex]);
  };

  const getSquareByIndex = (index: number): Element | null => {
    const squares = document.getElementsByClassName('square-grid')[0].children;

    if (squares.item(index)) {
      return squares.item(index);
    }
    return null;
  };

  return (
    <React.Fragment>
      <div className="square-grid">
        {updatedPassageArray.map((el, i) => {
          const bc = el.sentiment.label === "POSITIVE" ?
            `rgba(0,0,${el.sentiment.color},1)` :
            `rgba(${el.sentiment.color},0,0,1)`;
          const style = {
            backgroundColor: bc
          };

          return (
            <div 
                key={'sq' + i} 
                className="square group hover:translate-x-1 hover:translate-y-1 transition-transform" 
                style={style}
                onClick={(e) => onClickSquare(e, el)}
            >
                <span
        className="absolute hidden group-hover:flex -top-2 -right-3 translate-x-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2 before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700 square-tooltip-overflow">
        "{el.passage}" has label {el.sentiment.label}, score {el.sentiment.score}, and is segment #{el.segmentIndex+1} in passage #{el.index+1}.</span>
            </div>
          );
        })}
      </div>
      <br/>
      { selectedPassage &&
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
          <button
          className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={(e) => onNextClick(e, false)}
          >
              <h4 className={`mb-3 text-1xl`}>
                  {' '}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      &lt;
                  </span>
              </h4>
              {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
          </button>
          <Passage word={selectedPassage.passage} isLoading={false} message="" subtitle={selectedPassage.author} classes="flex-grow group" />
          <br/>
          <div className="flex-grow group">
            <h4>
              Label: {selectedPassage.sentiment.label}.
            </h4>
            <h4>
              Score: { (selectedPassage.sentiment.score * 100).toFixed(2) + "%"}.
            </h4>
            <h4>
              From passage #{selectedPassage.index}.
            </h4>
          </div>
          <button
          className="flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={(e) => onNextClick(e, true)}
          >
              <h4 className={`mb-3 text-1xl`}>
                  {' '}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      &gt;
                  </span>
              </h4>
              {/* <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p> */}
          </button>
        </div>
      }
    </React.Fragment>
  );
};