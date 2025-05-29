import { useState } from "react";

export interface DateSelectorValue {
  month: number;
  year: number;
}

interface Props {
  date: DateSelectorValue;
  onChange: (newDate: DateSelectorValue) => void;
}

export default function DateSelector({ date, onChange }: Props) {
  const [inputValue, setInputValue] = useState(
    `${date.month.toString().padStart(2, "0")}/${date.year}`
  );

  const changeMonth = (delta: number) => {
    let newMonth = date.month + delta;
    let newYear = date.year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    onChange({ month: newMonth, year: newYear });
    setInputValue(`${newMonth.toString().padStart(2, "0")}/${newYear}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const match = inputValue.match(/^(\d{1,2})\/(\d{4})$/);
    if (!match) {
      setInputValue(`${date.month.toString().padStart(2, "0")}/${date.year}`);
      return;
    }

    const newMonth = Math.max(1, Math.min(12, parseInt(match[1], 10)));
    const newYear = parseInt(match[2], 10);

    onChange({ month: newMonth, year: newYear });
    setInputValue(`${newMonth.toString().padStart(2, "0")}/${newYear}`);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <button className="btn btn-outline-secondary" onClick={() => changeMonth(-1)}>
        &lt;
      </button>

      <input
        type="text"
        className="form-control form-control-sm text-center"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        style={{ width: "100px" }}
        aria-label="Month and year"
      />

      <button className="btn btn-outline-secondary" onClick={() => changeMonth(1)}>
        &gt;
      </button>
    </div>
  );
}
