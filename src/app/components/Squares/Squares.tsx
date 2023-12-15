import { useEffect } from "react";
import Passage from "../PassageContainer";

interface SquareProps {
    updatedPassage: TextPassage;
    updatedPassageArray: TextPassage[];
}

export default function Squares({ updatedPassage, updatedPassageArray }: SquareProps) {
    useEffect(()=>{
        console.log(updatedPassageArray.length);
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
                        className="square hover:translate-x-1 hover:translate-y-1 transition-transform" 
                        style={style}
                        onClick={(e) => onClickSquare(e, el)}
                    >
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