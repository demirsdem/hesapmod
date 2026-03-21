"use client";

import React, { useState, useEffect } from "react";

interface BirthDatePickerProps {
  onChange: (date: Date) => void;
  defaultValue?: Date;
}

export function BirthDatePicker({ onChange, defaultValue }: BirthDatePickerProps) {
  // Format the default value robustly
  const [value, setValue] = useState(() => {
    if (defaultValue && !isNaN(defaultValue.getTime())) {
      const y = defaultValue.getFullYear();
      const m = String(defaultValue.getMonth() + 1).padStart(2, "0");
      const d = String(defaultValue.getDate()).padStart(2, "0");
      const hh = String(defaultValue.getHours()).padStart(2, "0");
      const mm = String(defaultValue.getMinutes()).padStart(2, "0");
      return `${y}-${m}-${d}T${hh}:${mm}`;
    }
    return "1990-01-01T12:00";
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    
    if (newVal) {
      const selectedDate = new Date(newVal);
      if (!isNaN(selectedDate.getTime())) {
        onChange(selectedDate);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-foreground mb-1">
        Doğum Tarihi ve Saati
      </label>
      
      <input
        type="datetime-local"
        min="1924-01-01T00:00"
        max="2010-12-31T23:59"
        value={value}
        onChange={handleChange}
        className="w-full flex items-center justify-between border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/50 transition-colors cursor-pointer text-base min-h-[48px]"
        style={{ borderRadius: "10px", padding: "12px", fontSize: "16px" }}
      />
    </div>
  );
}
