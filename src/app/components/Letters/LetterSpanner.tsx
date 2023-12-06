import { JSXElementConstructor, useEffect, useState } from "react";
import "./letterSpanStyles.css";

interface LetterSpannerProps {
  letterSpan: JSX.Element;
}

export default function LetterSpanner({
  letterSpan,
}: LetterSpannerProps) {
  const [letterSpanArray, setLetterSpanArray] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newLetterSpanArray = [...letterSpanArray, letterSpan];
    setLetterSpanArray(newLetterSpanArray);
  }, [letterSpan]);

  return (
    <>
      {letterSpanArray.map((letterSpan) => letterSpan )}
    </>
  );
}
