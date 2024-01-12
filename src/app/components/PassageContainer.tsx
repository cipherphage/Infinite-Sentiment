interface PassageProps {
  word: string;
  subtitle: string;
  isLoading: boolean;
  message: string;
  classes: string;
}

export default function Passage({ word, subtitle, isLoading, message, classes }: PassageProps) {

  return (
    <div className={`PassageContainer ${classes}`}>
      {isLoading && <h2 >{ message }</h2>}

      {!isLoading && <h3 style={{maxHeight:"250px",overflowY:"scroll"}}>
        {'"' + word + '"'}
      </h3>}
      <br/>

      {subtitle && <h4>
        {subtitle}
      </h4>}
    </div>
  );
}
