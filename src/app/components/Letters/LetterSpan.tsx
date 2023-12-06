interface LetterSpanProps {
  letter: string;
}

export default function LetterSpan({ letter }: LetterSpanProps) {
  return <span className="LetterSpan">
      {letter}
    </span>;
};