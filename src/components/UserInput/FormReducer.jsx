export const ACTION = {
  UpdateForm: "update-form",
  UpdateField: "update-field",
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
    case ACTION.UpdateForm:
      return action.payload.formState;
    case ACTION.UpdateField:
      const predicate = (field) => field.name === action.payload.field.name;
      const newFormState = Array.from(formState);
      newFormState.splice(newFormState.findIndex(predicate), 1, {
        ...newFormState.find(predicate),
        ...action.payload.field,
      });
      return newFormState;
    case ACTION.ClearFormError:
      return formState.map((field) => {
        return {
          ...field,
          hasError: false,
          errorMsg: null,
        };
      });
    default:
      return formState;
  }
}
