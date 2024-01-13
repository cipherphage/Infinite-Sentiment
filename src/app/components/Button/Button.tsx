import { MouseEventHandler } from "react";

interface ButtonProps {
  onClickCallback: MouseEventHandler<HTMLButtonElement>;
  buttonText: string | null;
  buttonSymbol: string | null;
  disabled?: boolean;
}
  
export default function Button({
  onClickCallback,
  buttonText,
  buttonSymbol,
  disabled = false,
}: ButtonProps) {
  const btnClassName = `flex-grow group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${disabled ? 'cursor-not-allowed disabled:opacity-50' : ''}`;
  const h4ClassName = 'mb-3 text-1xl';
  const lTSpanClassName = 'inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none';
  const gTSpanClassName = 'inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none';

  return (
    <button
      className={btnClassName}
      onClick={onClickCallback}
      disabled={disabled}>

      <h4 className={h4ClassName}>

        {((buttonSymbol === 'lessthan') || (buttonSymbol === 'both')) 
          && <span className={lTSpanClassName}>
              &lt;
            </span>
        }

        {' '}{ buttonText }{' '}

        {((buttonSymbol === 'greaterthan') || (buttonSymbol === 'both')) 
          && <span className={gTSpanClassName}>
              &gt;
            </span>
        }

      </h4>

    </button>
  );
};