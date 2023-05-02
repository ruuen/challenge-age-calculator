import { useState } from "react";
import { DateTime, Settings } from "luxon";
import DateDisplay from "./DateDisplay";
import UserInput from "./UserInput";

export default function AgeCalculator() {
  // Luxon setting to throw exceptions when a datetime is created as invalid
  Settings.throwOnInvalid = true;

  const [age, setAge] = useState({
    days: null,
    months: null,
    years: null,
  });

  function handleAgeChange({ year, month, day }) {
    const birthDate = DateTime.fromObject({ year: year, month: month, day: day });
    const ageCalc = DateTime.now().diff(birthDate, ["years", "months", "days"]).toObject();

    setAge({
      ...ageCalc,
      days: Math.floor(ageCalc.days),
    });
  }

  return (
    <div className="age-calculator">
      <UserInput handleAgeChange={handleAgeChange} />
      <DateDisplay age={age} />
    </div>
  );
}
