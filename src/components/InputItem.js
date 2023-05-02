export default function InputItem({ name, value, errorStatus, errorMessage, handleChange }) {
  const label = `${name.charAt(0).toUpperCase()}${name.substring(1)}`;

  return (
    <div className="inputs__input-group">
      <label htmlFor={name} className="inputs__input-label">
        {label}
      </label>
      <input
        type="number"
        name={name}
        placeholder="MM"
        className={`inputs__input inputs__input-${name} ${errorStatus ? "inputs__input--error" : ""}`}
        value={value == null ? "" : value}
        onChange={handleChange}
      />
      <span className="inputs__input-error">{errorMessage == null ? "" : errorMessage}</span>
    </div>
  );
}
