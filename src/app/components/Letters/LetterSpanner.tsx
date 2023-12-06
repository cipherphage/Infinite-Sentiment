import { useEffect, useState } from "react";
import "./letterSpanStyles.css";
import LetterSpan from "./LetterSpan";

interface LetterSpannerProps {
  letter: string;
}

export default function LetterSpanner({
  letter,
}: LetterSpannerProps) {
  const [letterArray, setLetterArray] = useState<string[]>([]);

  useEffect(() => {
    const newLetterArray = [...letterArray, letter];
    setLetterArray(newLetterArray);
  }, [letter]);

  return (
    <>
      {letterArray.map((letter, i) => (
        <LetterSpan key={i+letter+'-letterspan'} letter={letter} />
      ))}
    </>
  );
}
