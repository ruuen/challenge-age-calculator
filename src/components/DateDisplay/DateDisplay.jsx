import "./DateDisplay.scss";

export default function DateDisplay({ age }) {
  return (
    <div className="results">
      <div className="results__item">
        <span className="results__user">{age.years == null ? "--" : age.years}</span>
        <span className="results__field">years</span>
      </div>
      <div className="results__item">
        <span className="results__user">{age.months == null ? "--" : age.months}</span>
        <span className="results__field">months</span>
      </div>
      <div className="results__item">
        <span className="results__user">{age.days == null ? "--" : age.days}</span>
        <span className="results__field">days</span>
      </div>
    </div>
  );
}
