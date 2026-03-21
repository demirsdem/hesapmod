"use client";

import React, { useState, useEffect } from "react";

interface BirthDatePickerProps {
  onChange: (date: Date) => void;
  defaultValue?: Date;
}

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

// 1924 - 2010 range
const START_YEAR = 1924;
const END_YEAR = 2010;
const YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => END_YEAR - i);

export function BirthDatePicker({ onChange, defaultValue }: BirthDatePickerProps) {
  const defaultDate = defaultValue || new Date(1990, 0, 1);
  
  const [day, setDay] = useState(defaultDate.getDate());
  const [month, setMonth] = useState(defaultDate.getMonth());
  const [year, setYear] = useState(defaultDate.getFullYear());

  // Calculate days in the selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Determine available days correctly
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    // If we changed to a month with fewer days (e.g. 31 to 28), cap the day
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, year, day, daysInMonth]);

  useEffect(() => {
    const selectedDate = new Date(year, month, day);
    onChange(selectedDate);
  }, [day, month, year, onChange]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-sm font-medium text-foreground mb-1 text-center md:text-left">
        Doğum Tarihiniz
      </div>
      
      <div className="flex flex-row justify-between md:justify-start gap-2 sm:gap-4 w-full">
        {/* DAY SELECT */}
        <div className="flex flex-col flex-1 min-w-0">
          <label className="text-xs text-muted-foreground mb-1 text-center">Gün</label>
          <select 
            value={day} 
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full flex h-12 min-h-[48px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-[16px] md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/50 transition-colors appearance-none text-center cursor-pointer"
          >
            {daysArray.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* MONTH SELECT */}
        <div className="flex flex-col flex-1 min-w-[100px] sm:min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 text-center">Ay</label>
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full flex h-12 min-h-[48px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-[16px] md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/50 transition-colors appearance-none text-center cursor-pointer"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR SELECT */}
        <div className="flex flex-col flex-1 min-w-[80px] sm:min-w-[100px]">
          <label className="text-xs text-muted-foreground mb-1 text-center">Yıl</label>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full flex h-12 min-h-[48px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-[16px] md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/50 transition-colors appearance-none text-center cursor-pointer"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
