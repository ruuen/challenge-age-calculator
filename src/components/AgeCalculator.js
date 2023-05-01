import { useState } from "react";
import DateDisplay from "./DateDisplay";
import UserInput from "./UserInput";

export default function AgeCalculator() {
  const [birthday, setBirthday] = useState({
    day: 1,
    month: 1,
    year: 1900,
  });

  return (
    <div className="age-calculator">
      <UserInput birthday={birthday} />
      <DateDisplay />
    </div>
  );
}
