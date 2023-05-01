import { useState } from "react";
import { DateTime } from "luxon";
import submitIcon from "../media/icon-arrow.svg";

export default function UserInput({ handleAgeChange }) {
  const [birthday, setBirthday] = useState({
    day: null,
    month: null,
    year: null,
  });

  const [formError, setFormError] = useState({
    hasError: false,
    details: [],
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

  function validateFormInputs() {
    // Update the state to clear any old errors
    setFormError({
      hasError: false,
      details: [],
    });

    const errors = [];
    const fieldData = Object.entries(birthday);

    // Individual field value checks
    fieldData.forEach((field) => {
      const fieldName = field[0];
      const value = field[1];

      // Check if field empty
      if (value == "") {
        errors.push({
          field: fieldName,
          message: "This field is required",
        });

        return;
      }

      // Check if field values within correct number range
      switch (fieldName) {
        case "day":
          if (value < 1 || value > 31) {
            errors.push({
              field: fieldName,
              message: "Must be a valid day",
            });
          }
          return;
        case "month":
          if (value < 1 || value > 12) {
            errors.push({
              field: fieldName,
              message: "Must be a valid month",
            });
          }
          return;
        case "year":
          if (value < 1900)
            errors.push({
              field: fieldName,
              message: "Must be after 1900",
            });
          return;
        default:
          break;
      }
    });

    // Check if provided input values make a valid date
    let date;
    try {
      date = DateTime.fromObject({
        year: birthday.year,
        month: birthday.month,
        day: birthday.day,
      });
    } catch (error) {
      errors.splice(0, errors.length, {
        field: "day",
        message: "Must be a valid date",
      });
      return;
    }

    // // Check if provided date is in the past
    // if (date > DateTime.now()) {
    //   errors.push({
    //     fieldName: "year",
    //     message: "Must be in the past",
    //   });
    //   return;
    // }

    // If there were any errors found, update the associated state
    if (errors.length == 0) return;

    setFormError({
      hasError: true,
      details: errors,
    });

    return;
  }

  function handleSubmit(e) {
    e.preventDefault();

    validateFormInputs();

    if (formError.hasError) return;

    // TODO: add error handling functionality & remove alert placeholders
    // if (birthday.day === "" || birthday.month === "" || birthday.year === "") {
    //   alert("Field empty");
    //   return;
    // }

    // if (birthday.day < 1 || birthday.day > 31) {
    //   alert("Day out of range");
    //   return;
    // }

    // if (birthday.month < 1 || birthday.month > 12) {
    //   alert("Month out of range");
    //   return;
    // }

    // if (birthday.year < 1900) {
    //   alert("Year out of range");
    //   return;
    // }

    // let date;
    // try {
    //   date = DateTime.fromObject({
    //     year: birthday.year,
    //     month: birthday.month,
    //     day: birthday.day,
    //   });
    // } catch (error) {
    //   alert("Invalid date");
    //   return;
    // }

    // if (date > DateTime.now()) {
    //   alert("Date in future");
    //   return;
    // }

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
          value={birthday.day == null ? "" : birthday.day}
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
          value={birthday.month == null ? "" : birthday.month}
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
          value={birthday.year == null ? "" : birthday.year}
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
