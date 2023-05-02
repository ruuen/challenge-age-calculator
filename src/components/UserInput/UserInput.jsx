import { useReducer, useState } from "react";
import { DateTime } from "luxon";
import submitIcon from "../../media/icon-arrow.svg";
import InputItem from "../InputItem/InputItem";
import { formReducer, initialState } from "./FormReducer";

export default function UserInput({ handleAgeChange }) {
  const [birthday, setBirthday] = useState([
    {
      field: "day",
      value: null,
      hasError: false,
      errorMsg: null,
    },
    {
      field: "month",
      value: null,
      hasError: false,
      errorMsg: null,
    },
    {
      field: "year",
      value: null,
      hasError: false,
      errorMsg: null,
    },
  ]);

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const inputElements = birthday.map((field, index) => {
    return (
      <InputItem
        key={index}
        name={field.field}
        value={field.value}
        errorStatus={field.hasError}
        errorMessage={field.errorMsg}
        handleChange={handleChange}
      />
    );
  });

  // TODO: Convert to reducer action
  //    DONE
  function handleChange(e) {
    setBirthday((prevBirthdayFields) => {
      const predicate = (fieldObj) => fieldObj.field === e.target.name;

      return prevBirthdayFields.toSpliced(prevBirthdayFields.findIndex(predicate), 1, {
        ...prevBirthdayFields.find(predicate),
        value: e.target.value,
      });
    });
  }

  // TODO: Convert to reducer action
  //    DONE
  function handleClearError() {
    setBirthday((prevBirthdayFields) => {
      return prevBirthdayFields.map((fieldObj) => {
        return {
          ...fieldObj,
          hasError: false,
          errorMsg: null,
        };
      });
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validate birthday value inputs against specified rules
    // Return a new array of birthday fields, updated with any validation errors
    const formState = validateFormInputs(birthday);

    // If any field errors exist, update birthday field list state
    if (formState.find((fieldObj) => fieldObj.hasError === true)) {
      // TODO: Convert to reducer action
      //    Done
      setBirthday(formState);
      return;
    }

    // If no errors, pass birthdate into a date obj in the age calc fn call, then clear all input errors.
    // TODO: When reducer swapped in, change these field.field refs to field.name
    handleAgeChange({
      year: formState.find((field) => field.field === "year").value,
      month: formState.find((field) => field.field === "month").value,
      day: formState.find((field) => field.field === "day").value,
    });
    // TODO: Call the reducer dispatch with type: ACTION.ClearFormError action instead
    handleClearError();
  }

  // TODO: removed, moved to reducer action
  function validateFormInputs(birthday) {
    // Copy the passed field state array
    let formState = Array.from(birthday);

    // Loop through the state array to perform field validations
    formState = formState.map((fieldObj) => {
      const { field, value } = fieldObj;

      // Don't allow any null or empty value fields
      if (value === "" || value === null) {
        return {
          ...fieldObj,
          hasError: true,
          errorMsg: "This field is required",
        };
      }

      if (field === "day" && (value < 1 || value > 31)) {
        return {
          ...fieldObj,
          hasError: true,
          errorMsg: "Must be a valid day",
        };
      }

      if (field === "month" && (value < 1 || value > 12)) {
        return {
          ...fieldObj,
          hasError: true,
          errorMsg: "Must be a valid month",
        };
      }

      if (field === "year" && value < 1900) {
        return {
          ...fieldObj,
          hasError: true,
          errorMsg: "Year must be after 1900",
        };
      }

      return {
        ...fieldObj,
        hasError: false,
        errorMsg: null,
      };
    });

    // If any individual fields have errors, return the updated state list & stop further checks
    if (formState.find((fieldObj) => fieldObj.hasError === true)) {
      return formState;
    }

    // Don't allow to proceed if user's values don't make a valid date (ie. 31/4 when April has 30 days)
    let userDate;
    try {
      userDate = DateTime.fromObject({
        year: formState.find((field) => field.field === "year").value,
        month: formState.find((field) => field.field === "month").value,
        day: formState.find((field) => field.field === "day").value,
      });
    } catch (error) {
      const predicate = (fieldObj) => fieldObj.field === "day";
      return formState.toSpliced(formState.findIndex(predicate), 1, {
        ...formState.find(predicate),
        hasError: true,
        errorMsg: "Must be a valid date",
      });
    }

    // Don't allow user's birthday to be in the future
    if (userDate > DateTime.now()) {
      const predicate = (fieldObj) => fieldObj.field === "year";
      return formState.toSpliced(formState.findIndex(predicate), 1, {
        ...formState.find(predicate),
        hasError: true,
        errorMsg: "Must be in the past",
      });
    }

    // Since no errors are received at this point, return the clean birthday state list
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
