import React, { useEffect, useState } from "react";

import Passage from "../PassageContainer";
import Button from "../Button/Button";
import Tooltip from "../Info/Tooltip";

interface SquareProps {
  updatedPassage: TextPassage;
  updatedPassageArray: TextPassage[];
}

export default function Squares({ updatedPassage, updatedPassageArray }: SquareProps) {
  const [selectedNode, setSelectedNode] = useState<Element | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<TextPassage | null>(null);
  const [isUserSelected, setIsUserSelected] = useState(false);

  useEffect(() => {
    if (!isUserSelected) {
      setSelectedNode(getSquareByIndex(updatedPassage.segmentIndex));
      setSelectedPassage(updatedPassage);
    }
  }, [updatedPassage]);

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
      setIsUserSelected(false);
    } else {
      setSelectedNode(e.currentTarget);
      setSelectedPassage(passage);
      setIsUserSelected(true);
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
    setIsUserSelected(true);
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
              onClick={(e) => onClickSquare(e, el)} >
                <Tooltip textPassage={el} />
            </div>
          );
        })}
      </div>
      <br/>
      { selectedPassage &&
        <div className="flex mb-3 text-center lg:max-w-5xl lg:w-full">
          <Button
            onClickCallback={(e) => onNextClick(e, false)}
            buttonText={null}
            buttonSymbol="lessthan" />

          <Passage
            word={selectedPassage.passage}
            isLoading={false}
            message=""
            subtitle={selectedPassage.author}
            classes="flex-grow group" />
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
          
          <Button
            onClickCallback={(e) => onNextClick(e, false)}
            buttonText={null}
            buttonSymbol="greaterthan" />
        </div>
      }
    </React.Fragment>
  );
};