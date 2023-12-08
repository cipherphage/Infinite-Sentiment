import { useEffect, useState } from "react";
import LetterSpanner from "./Letters/LetterSpanner";
import { typerPauseRandom } from "../utils/helpers";
import { defaultLetter } from "../utils/defaults";

interface TyperProps {
  word: string;
  subtitle: string;
  isLoading: boolean;
  message: string;
  classes: string;
  typingStatus: boolean;
}

export default function Typer({ word, subtitle, isLoading, message, classes, typingStatus }: TyperProps) {
  const [mainLetter, setMainLetter] = useState<Letter>(defaultLetter);
  const [mainLetterMap, setMainLetterMap] = useState<Map<number, string>>(new Map);
  const [subLetter, setSubLetter] = useState<Letter>(defaultLetter);
  const [subLetterMap, setSubLetterMap] = useState<Map<number, string>>(new Map);

  // After word is loaded create Map of letters.
  useEffect(() => {
    if (!isLoading) {
      if (mainLetterMap.size === 0) {
        const newMainMap = new Map();
        const newSubMap = new Map();
        word.split('').forEach((letter, i) => newMainMap.set(i,letter));
        subtitle.split('').forEach((letter, i) => newSubMap.set(i,letter));
        setSubLetterMap(newSubMap);
        setMainLetterMap(newMainMap);
      }
      // Check letterSpan default to ensure existing letters aren't duplicated.
      if ((mainLetterMap.size > 0) && (mainLetter.i === -1)) {
        typewriter();
      }
    }
  }, [isLoading, mainLetterMap]);

  // Creates LetterSpans one at a time with typing timeout effect.
  const typewriter = async () => {
    for (const [i, letter] of mainLetterMap) {
      await typerPauseRandom();
      const newLetter: Letter = {'i': i, 'letter': letter};
      setMainLetter(newLetter);
    }

    for (const [i, letter] of subLetterMap) {
      await typerPauseRandom();
      const newLetter: Letter = {'i': i, 'letter': letter};
      setSubLetter(newLetter);
    }
  };

  return (
    <div className="TyperContainer">
      {isLoading && <h2 className="TyperLoadingTitle">{ message }</h2>}

      {!isLoading && <h3 className={`TyperMainLetterSpanner ${classes}`}>
        { message } <span> </span>
        { typingStatus ? <LetterSpanner letter={mainLetter} /> : <>{word}</> }
      </h3>}

      {subtitle && <h4 className="TyperSubtitleLetterSpanner">
        { typingStatus ? <LetterSpanner letter={subLetter} /> : <>{subtitle}</> }
      </h4>}
    </div>
  );
}
