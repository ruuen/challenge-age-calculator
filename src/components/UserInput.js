import submitIcon from "../media/icon-arrow.svg";

export default function UserInput({ birthday }) {
  return (
    <form className="inputs">
      <div className="inputs__date-group">
        <label htmlFor="day" className="inputs__input-label">
          Day
        </label>
        <input type="text" name="day" placeholder="DD" className="inputs__input inputs__day" maxLength="2" />
        <label htmlFor="month" className="inputs__input-label">
          Month
        </label>
        <input type="text" name="month" placeholder="MM" className="inputs__input inputs__month" maxLength="2" />
        <label htmlFor="year" className="inputs__input-label">
          Year
        </label>
        <input type="text" name="year" placeholder="YYYY" className="inputs__input inputs__year" maxLength="4" />
      </div>
      <div className="inputs__btn-group">
        <button type="submit">
          <img src={submitIcon}></img>
        </button>
      </div>
    </form>
  );
}
