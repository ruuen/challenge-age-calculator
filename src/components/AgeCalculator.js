import { useState } from "react";
import DateDisplay from "./DateDisplay";
import UserInput from "./UserInput";

export default function AgeCalculator() {
  const [age, setAge] = useState({
    day: null,
    month: null,
    year: null,
  });

  function handleAgeChange({ day, month, year }) {
    // TODO:
    // Call calc and store result as age state
    console.log(birthDate);
  }

  function calculateAge() {
    // TODO:
    // Implement this calc
  }

  return (
    <div className="age-calculator">
      <UserInput handleAgeChange={handleAgeChange} />
      <DateDisplay age={age} />
    </div>
  );
}
