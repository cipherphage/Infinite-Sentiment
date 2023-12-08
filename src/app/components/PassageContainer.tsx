import { useEffect, useState } from "react";

interface PassageProps {
  word: string;
  subtitle: string;
  isLoading: boolean;
  message: string;
  classes: string;
}

export default function Passage({ word, subtitle, isLoading, message, classes }: PassageProps) {

  return (
    <div className="PassageContainer">
      {isLoading && <h2 className="PassageLoadingTitle">{ message }</h2>}

      {!isLoading && <h3 className={`TyperMainLetterSpanner ${classes}`}>
        {word}
      </h3>}

      {subtitle && <h4 className="TyperSubtitleLetterSpanner">
        {subtitle}
      </h4>}
    </div>
  );
}
