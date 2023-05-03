import { ACTION } from "../UserInput/FormReducer";
import "./InputItem.scss";

export default function InputItem({ name, value, errorStatus, errorMessage, dispatch }) {
  const label = `${name.charAt(0).toUpperCase()}${name.substring(1)}`;
  let placeholder;
  if (name === "day") {
    placeholder = "DD";
  } else if (name === "month") {
    placeholder = "MM";
  } else if (name === "year") {
    placeholder = "YYYY";
  }

  function handleChange(e) {
    dispatch({
      type: ACTION.UpdateField,
      payload: {
        field: {
          name: e.target.name,
          value: e.target.value,
        },
      },
    });
  }

  return (
    <div className="inputs__input-group">
      <label htmlFor={name} className={`inputs__input-label ${errorStatus ? "inputs__input-label--error" : ""}`}>
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        id={name}
        name={name}
        placeholder={placeholder}
        className={`inputs__input inputs__input-${name} ${errorStatus ? "inputs__input--error" : ""}`}
        value={value == null ? "" : value}
        onChange={handleChange}
      />
      <span className="inputs__input-message">{errorMessage == null ? "" : errorMessage}</span>
    </div>
  );
}
