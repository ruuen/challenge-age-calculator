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

  function handleSubmit(e) {
    e.preventDefault();

    // Validate birthday value inputs against specified rules
    // Return a state object determing if form valid/invalid, and list of errors
    const formState = validateFormInputs(birthday);

    // If form valid, update the component form error state and call the age state update
    if (!formState.hasError) {
      setFormError(formState);
      handleAgeChange(birthday);
      return;
    }

    // If form invalid, update the component form error state
    setFormError(formState);
  }

  function validateFormInputs(birthday) {
    // Initialise an object with a valid form state
    // This is modified/replaced throughout and gets returned on each logic path
    let formState = {
      hasError: false,
      details: [],
    };

    // Initialise an array of arrays containing each field name and value for comparison
    const fieldData = Object.entries(birthday);

    // Perform individual field value checks here
    fieldData.forEach((field) => {
      const fieldName = field[0];
      const value = field[1];

      // Check if field empty
      if (value === "" || value === null) {
        formState.details.push({
          field: fieldName,
          message: "This field is required",
        });
        return;
      }

      // Check if field values within correct number range
      switch (fieldName) {
        case "day":
          if (value < 1 || value > 31) {
            formState.details.push({
              field: fieldName,
              message: "Must be a valid day",
            });
          }
          return;
        case "month":
          if (value < 1 || value > 12) {
            formState.details.push({
              field: fieldName,
              message: "Must be a valid month",
            });
          }
          return;
        case "year":
          if (value < 1900) {
            formState.details.push({
              field: fieldName,
              message: "Must be after 1900",
            });
          }
          return;
        default:
          break;
      }
    });

    // If field errors found, return updated state obj & prevent further checks
    if (formState.details.length > 0) {
      formState = {
        ...formState,
        hasError: true,
      };
      return formState;
    }

    // Check if provided input values make a valid date
    // If invalid, return updated state obj & prevent further checks
    try {
      DateTime.fromObject({
        year: birthday.year,
        month: birthday.month,
        day: birthday.day,
      });
    } catch (error) {
      formState = {
        hasError: true,
        details: [
          {
            field: "day",
            message: "Must be a valid date",
          },
        ],
      };
      return formState;
    }

    // Check if provided date is in the past
    // If invalid, return updated state obj & prevent further checks
    const userDate = DateTime.fromObject({
      year: birthday.year,
      month: birthday.month,
      day: birthday.day,
    });

    if (userDate > DateTime.now()) {
      formState = {
        hasError: true,
        details: [
          {
            fieldName: "year",
            message: "Must be in the past",
          },
        ],
      };
      return formState;
    }

    // If no validation errors are flagged, return the initial valid state obj
    return formState;
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
