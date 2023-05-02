export default function InputItem({ name, value, handleChange }) {
  const label = `${name.charAt(0).toUpperCase()}${name.substring(1)}`;

  return (
    <>
      <label htmlFor={name} className="inputs__input-label">
        {label}
      </label>
      <input
        type="number"
        name={name}
        placeholder="MM"
        className={`inputs__input inputs__${name}`}
        value={value == null ? "" : value}
        onChange={handleChange}
      />
    </>
  );
}
