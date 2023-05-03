import { useReducer } from "react";
import { DateTime, Settings } from "luxon";
import submitIcon from "../../media/icon-arrow.svg";
import InputItem from "../InputItem/InputItem";
import { ACTION, formReducer, initialState } from "./FormReducer";
import "./UserInput.scss";

export default function UserInput({ handleAgeChange }) {
  Settings.throwOnInvalid = true;

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const inputElements = formState.map((field, index) => {
    return (
      <InputItem
        key={index}
        name={field.name}
        value={field.value}
        errorStatus={field.hasError}
        errorMessage={field.errorMsg}
        dispatch={dispatch}
      />
    );
  });

  function handleSubmit(e) {
    e.preventDefault();

    // Validate birthday value inputs against specified rules
    const newFormState = validateFormInputs(formState);

    if (newFormState.find((field) => field.hasError === true)) {
      dispatch({
        type: ACTION.UpdateForm,
        payload: {
          formState: newFormState,
        },
      });
      return;
    }

    // If no errors, pass birthdate into a date obj in the age calc fn call, then clear all input errors.
    handleAgeChange({
      year: formState.find((field) => field.name === "year").value,
      month: formState.find((field) => field.name === "month").value,
      day: formState.find((field) => field.name === "day").value,
    });
    dispatch({
      type: ACTION.ClearFormError,
    });
  }

  function validateFormInputs(formData) {
    // Loop through the state array to perform field validations
    const validatedFields = formData.map((field) => {
      const { name, value } = field;

      // Don't allow any null or empty value fields
      if (value === "" || value === null) {
        return {
          ...field,
          hasError: true,
          errorMsg: "This field is required",
        };
      }

      // Don't allow any character other than numerals
      const regex = new RegExp("[^0-9]");
      if (regex.test(value)) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Must be a number",
        };
      }

      const valueNum = parseInt(value);

      if (name === "day" && (valueNum < 1 || valueNum > 31)) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Must be a valid day",
        };
      }

      if (name === "month" && (valueNum < 1 || valueNum > 12)) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Must be a valid month",
        };
      }

      if (name === "year" && valueNum < 1900) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Year must be after 1900",
        };
      }

      return {
        ...field,
        hasError: false,
        errorMsg: null,
      };
    });

    // If any individual fields have errors, return the updated state list & stop further checks
    if (validatedFields.find((field) => field.hasError === true)) {
      return validatedFields;
    }

    // Don't allow to proceed if user's values don't make a valid date (ie. 31/4 when April has 30 days)
    let userDate;
    try {
      userDate = DateTime.fromObject({
        year: validatedFields.find((field) => field.name === "year").value,
        month: validatedFields.find((field) => field.name === "month").value,
        day: validatedFields.find((field) => field.name === "day").value,
      });
    } catch (error) {
      const predicate = (field) => field.name === "day";
      const newFormState = Array.from(validatedFields);
      newFormState.splice(newFormState.findIndex(predicate), 1, {
        ...newFormState.find(predicate),
        hasError: true,
        errorMsg: "Must be a valid date",
      });
      return newFormState;
    }

    // Don't allow user's birthday to be in the future
    if (userDate > DateTime.now()) {
      const predicate = (field) => field.name === "year";
      const newFormState = Array.from(validatedFields);
      newFormState.splice(newFormState.findIndex(predicate), 1, {
        ...newFormState.find(predicate),
        hasError: true,
        errorMsg: "Must be in the past",
      });
      return newFormState;
    }

    // Since no errors are received at this point, return the clean birthday state list
    return validatedFields;
  }

  return (
    <form className="inputs" onSubmit={handleSubmit}>
      <div className="inputs__date-group">{inputElements}</div>
      <div className="inputs__btn-group">
        <div className="inputs__divider"></div>
        <button className="inputs__btn" type="submit">
          <img className="inputs__btn-icon" src={submitIcon} alt="Arrow" />
        </button>
      </div>
    </form>
  );
}
