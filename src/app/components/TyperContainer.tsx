import { useEffect, useState } from "react";
import LetterSpanner from "./Letters/LetterSpanner";
import { typerPauseRandom } from "../utils/helpers";
import LetterSpan from "./Letters/LetterSpan";

interface TyperProps {
  word: string;
  subtitle: string;
  isLoading: boolean;
  message: string;
}

export default function Typer({ word, subtitle, isLoading, message }: TyperProps) {
  const [mainLetterSpan, setMainLetterSpan] = useState<JSX.Element>(
    <span key="init1"></span>);
  const [mainLetterMap, setMainLetterMap] = useState<Map<number, string>>(new Map);
  const [subLetterSpan, setSubLetterSpan] = useState<JSX.Element>(
    <span key="init2"></span>);
  const [subLetterMap, setSubLetterMap] = useState<Map<number, string>>(new Map);

  // After ip is loaded create Map of letters.
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
      if ((mainLetterMap.size > 0) && (mainLetterSpan.key === 'init1')) {
        typewriter();
      }
    }
  }, [isLoading, mainLetterMap]);

  // Creates LetterSpans one at a time with typing timeout effect.
  const typewriter = async () => {
    for (const [i, letter] of mainLetterMap) {
      await typerPauseRandom();
      const newLetterSpan = <LetterSpan k={i+letter} letter={letter} />;
      setMainLetterSpan(newLetterSpan);
    }

    for (const [i, letter] of subLetterMap) {
      await typerPauseRandom();
      const newLetterSpan = <LetterSpan k={i+letter} letter={letter} />;
      setSubLetterSpan(newLetterSpan);
    }
  };

  return (
    <div className="TyperContainer">
      {isLoading && <h2 className="TyperLoadingTitle">{ message }</h2>}

      {!isLoading && <h3 className="TyperMainLetterSpanner">
        { message } <span> </span>
        <LetterSpanner key="letterspanner1" letterSpan={mainLetterSpan} />
      </h3>}

      {subtitle && <h4 className="TyperSubtitleLetterSpanner">
        <LetterSpanner key="letterspanner2" letterSpan={subLetterSpan} />
      </h4>}
    </div>
  );
}
