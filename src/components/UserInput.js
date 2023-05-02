import { useState } from "react";
import { DateTime } from "luxon";
import submitIcon from "../media/icon-arrow.svg";
import InputItem from "./InputItem";

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

  const inputElements = Object.keys(birthday).map((item, index) => {
    return <InputItem key={index} name={item} value={birthday[item]} handleChange={handleChange} />;
  });

  function handleChange(e) {
    setBirthday((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
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
      <div className="inputs__date-group">{inputElements}</div>
      <div className="inputs__btn-group">
        <button type="submit">
          <img src={submitIcon} alt="Arrow" />
        </button>
      </div>
    </form>
  );
}
