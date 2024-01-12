interface InfoProps {
  passageIndexPlusOne: number;
  textArrayLength: number;
  updatedPassageArrayLength: number;
  granularity: Intl.SegmenterOptions["granularity"];
  done: boolean;
  ready: boolean;
}

export default function Info({
  passageIndexPlusOne,
  textArrayLength,
  updatedPassageArrayLength,
  granularity,
  done,
  ready
}: InfoProps) {
  return (
    <div>
      <br/>
      { (!done && ready) && 
        <h4>
          Analyzing passage #{ passageIndexPlusOne } of { textArrayLength }
          <span className="animate-ping">...</span>
        </h4>
      }
      { (done && ready) && 
        <h4>
          Done. Analyzed { updatedPassageArrayLength } { granularity }s from { textArrayLength } passages.
        </h4>
      }
      <br/>
    </div>
  );
};