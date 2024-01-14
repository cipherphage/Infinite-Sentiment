interface TooltipProps {
  textPassage: TextPassage;
}
  
export default function Tooltip({
  textPassage,
}: TooltipProps) {
  const className = "absolute hidden group-hover:flex -top-2 -right-3 translate-x-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2 before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700 square-tooltip-overflow";

  return (
    <span
        className={className}>
        "{ textPassage.passage }" has label { textPassage.sentiment.label }, score { textPassage.sentiment.score }, and is segment #{ textPassage.segmentIndex+1 } in passage #{ textPassage.passageIndex+1 }.
    </span>
  );
};