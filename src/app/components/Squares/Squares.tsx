import { useEffect } from "react";

interface SquareProps {
    updatedPassageArray: TextPassage[];
}

export default function Squares({ updatedPassageArray }: SquareProps) {
    useEffect(()=>{
        console.log(updatedPassageArray.length);
    }, [updatedPassageArray]);

    const onClickSquare = (e: React.MouseEvent, passage: TextPassage) => {
        console.log(e.currentTarget);
        console.log(passage);
    };

    return (
        <>
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
        </>
    );
};