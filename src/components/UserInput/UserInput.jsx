import { useReducer } from "react";
import { DateTime, Settings } from "luxon";
import submitIcon from "../../media/icon-arrow.svg";
import InputItem from "../InputItem/InputItem";
import { ACTION, formReducer, initialState } from "./FormReducer";

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

      if (name === "day" && (value < 1 || value > 31)) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Must be a valid day",
        };
      }

      if (name === "month" && (value < 1 || value > 12)) {
        return {
          ...field,
          hasError: true,
          errorMsg: "Must be a valid month",
        };
      }

      if (name === "year" && value < 1900) {
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
      return validatedFields.toSpliced(validatedFields.findIndex(predicate), 1, {
        ...validatedFields.find(predicate),
        hasError: true,
        errorMsg: "Must be a valid date",
      });
    }

    // Don't allow user's birthday to be in the future
    if (userDate > DateTime.now()) {
      const predicate = (field) => field.name === "year";
      return validatedFields.toSpliced(validatedFields.findIndex(predicate), 1, {
        ...validatedFields.find(predicate),
        hasError: true,
        errorMsg: "Must be in the past",
      });
    }

    // Since no errors are received at this point, return the clean birthday state list
    return validatedFields;
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
