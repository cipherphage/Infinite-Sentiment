interface LetterSpanProps {
  k: string;
  letter: string;
}

export default function LetterSpan({ k, letter }: LetterSpanProps) {
  return <span key={k} className="LetterSpan">
      {letter}
    </span>;
};