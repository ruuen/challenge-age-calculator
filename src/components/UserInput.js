import { useState } from "react";
import submitIcon from "../media/icon-arrow.svg";

export default function UserInput({ handleAgeChange }) {
  const [birthday, setBirthday] = useState({
    day: null,
    month: null,
    year: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setBirthday((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // TODO:
    // Implement proper validation actions when styling is sorted out
    if (birthday.day == "" || birthday.month == "" || birthday.year == "") {
      console.log("Field empty");
      return;
    }

    if (birthday.day < 1 || birthday.day > 31) {
      console.log("Day out of range");
      return;
    }

    if (birthday.month < 1 || birthday.month > 12) {
      console.log("Month out of range");
      return;
    }
    // TODO:
    // Improve this validation to only reject years if the date is in future
    if (birthday.year < 1900 || birthday.year > 2023) {
      console.log("Year out of range");
      return;
    }

    handleAgeChange(birthday);
  }

  return (
    <form className="inputs" onSubmit={handleSubmit}>
      <div className="inputs__date-group">
        <label htmlFor="day" className="inputs__input-label">
          Day
        </label>
        <input
          type="number"
          name="day"
          placeholder="DD"
          className="inputs__input inputs__day"
          value={birthday.day}
          onChange={handleChange}
        />
        <label htmlFor="month" className="inputs__input-label">
          Month
        </label>
        <input
          type="number"
          name="month"
          placeholder="MM"
          className="inputs__input inputs__month"
          value={birthday.month}
          onChange={handleChange}
        />
        <label htmlFor="year" className="inputs__input-label">
          Year
        </label>
        <input
          type="number"
          name="year"
          placeholder="YYYY"
          className="inputs__input inputs__year"
          value={birthday.year}
          onChange={handleChange}
        />
      </div>
      <div className="inputs__btn-group">
        <button type="submit">
          <img src={submitIcon} alt="Arrow" />
        </button>
      </div>
    </form>
  );
}
