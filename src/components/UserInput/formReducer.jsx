import { DateTime, Settings } from "luxon";
Settings.throwOnInvalid = true;

export const ACTION = {
  Update: "update",
  UpdateField: "update-field",
  Validate: "validate",
  ClearFormError: "clear-error",
};

export const initialState = [
  {
    name: "day",
    value: null,
    hasError: false,
    errorMsg: null,
  },
  {
    name: "month",
    value: null,
    hasError: false,
    errorMsg: null,
  },
  {
    name: "year",
    value: null,
    hasError: false,
    errorMsg: null,
  },
];

export function formReducer(formState, action) {
  switch (action.type) {
    case ACTION.Update:
      return action.payload.formState;
    case ACTION.UpdateField:
      const predicate = (field) => field.name === action.payload.field.name;
      return formState.toSpliced(formState.findIndex(predicate), 1, {
        ...formState.find(predicate),
        ...action.payload.field,
      });
    case ACTION.ClearFormError:
      return formState.map((field) => {
        return {
          ...field,
          hasError: false,
          errorMsg: null,
        };
      });
    case ACTION.Validate:
      // Check individual fields
      const validatedFields = validateFields(formState);

      if (validatedFields.find((field) => field.hasError === true)) {
        return validatedFields;
      }

      // Check if user provided values make a valid date
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

      // Check if user provided date is in the future
      if (userDate > DateTime.now()) {
        const predicate = (field) => field.name === "year";
        return validatedFields.toSpliced(validatedFields.findIndex(predicate), 1, {
          ...validatedFields.find(predicate),
          hasError: true,
          errorMsg: "Must be in the past",
        });
      }

      // Otherwise return the validated fields to be saved into state
      return validatedFields;
    default:
      return formState;
  }
}

function validateFields(fields) {
  return fields.map((field) => {
    const { name, value } = field;
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

    return field;
  });
}
