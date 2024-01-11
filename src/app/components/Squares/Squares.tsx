import { useEffect } from "react";
import Passage from "../PassageContainer";

interface SquareProps {
  updatedPassage: TextPassage;
  updatedPassageArray: TextPassage[];
}

export default function Squares({ updatedPassage, updatedPassageArray }: SquareProps) {
  useEffect(()=>{
    //console.log(updatedPassageArray.length);
  }, [updatedPassageArray]);

  const onClickSquare = (e: React.MouseEvent, passage: TextPassage) => {
    console.log(e.currentTarget);
    console.log(passage);
  };

  return (
    <>
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
      className="absolute hidden group-hover:flex -top-2 -right-3 translate-x-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700">
      "{el.passage}" has label {el.sentiment.label}, score {el.sentiment.score}, and is index {el.index} out of {updatedPassageArray.length-1}.</span>
          </div>
        );
      })}
      </div>
      <br/>
      <Passage word={updatedPassage.passage} isLoading={false} message="" subtitle={updatedPassage.author} classes="" />
      <br/>
      <div>
        <h4>
          Label: {updatedPassage.sentiment.label}.
        </h4>
        <h4>
          Score: { (updatedPassage.sentiment.score * 100).toFixed(2) + "%"}.
        </h4>
        <h4>
          Passage #{updatedPassage.index}.
        </h4>
      </div>
    </>
  );
};