"use client";

import React, { useState, useEffect } from "react";

interface BirthDatePickerProps {
  onChange: (date: Date) => void;
  defaultValue?: Date;
  /** Field heading. Defaults to the birth-date wording for backward compatibility. */
  label?: string;
  /** Selectable year bounds. Defaults to the birth-date range. */
  yearRange?: { min: number; max: number };
  /** Show the hour/minute row. Defaults to true. */
  showTime?: boolean;
}

const DEFAULT_YEAR_RANGE = { min: 1924, max: 2010 };

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function BirthDatePicker({
  onChange,
  defaultValue,
  label = "Doğum Tarihi ve Saati",
  yearRange = DEFAULT_YEAR_RANGE,
  showTime = true,
}: BirthDatePickerProps) {
  // Enforce the default value based on props or user's requested default
  const [initDate] = useState(() => {
    if (defaultValue && !isNaN(defaultValue.getTime())) {
      return defaultValue;
    }
    // Fall back to a date inside the allowed range: 1990 for birth dates,
    // otherwise today clamped into the configured bounds.
    const fallbackYear = Math.min(
      Math.max(1990, yearRange.min),
      yearRange.max
    );
    const today = new Date();
    if (today.getFullYear() >= yearRange.min && today.getFullYear() <= yearRange.max) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0);
    }
    return new Date(fallbackYear, 0, 1, 12, 0);
  });

  const [day, setDay] = useState(initDate.getDate());
  const [month, setMonth] = useState(initDate.getMonth());
  const [year, setYear] = useState<number | "">(initDate.getFullYear());
  const [hour, setHour] = useState(initDate.getHours());
  const [minute, setMinute] = useState(initDate.getMinutes());

  // Avoid running onChange on initial render unless it differs from defaultValue.
  // Actually, standard controlled component behavior is fine here.
  const [mounted, setMounted] = useState(false);

  // Focus and clamp states
  const safeYear = typeof year === "number" ? year : initDate.getFullYear();
  const daysInMonth = new Date(safeYear, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, safeYear, day, daysInMonth]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    const safeY = typeof year === "number" ? year : initDate.getFullYear();
    const selectedDate = new Date(safeY, month, day, hour, minute);
    onChange(selectedDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year, hour, minute]);

  return (
    <div className="flex w-full max-w-full flex-col gap-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="text-sm font-semibold text-slate-700">
        {label}
      </div>
      
      {/* Upper Row: Day | Month | Year */}
      <div className="grid w-full grid-cols-3 gap-2 sm:gap-4">
        {/* DAY */}
        <div className="flex min-w-0 flex-col">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Gün</label>
          <div className="relative">
            <select 
              value={day} 
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full h-12 min-h-[48px] appearance-none rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 cursor-pointer"
            >
              {daysArray.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* MONTH */}
        <div className="flex min-w-0 flex-col">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Ay</label>
          <div className="relative">
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full h-12 min-h-[48px] appearance-none rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 cursor-pointer"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* YEAR (Number input) */}
        <div className="flex min-w-0 flex-col">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Yıl</label>
          <input 
            type="number"
            min={yearRange.min}
            max={yearRange.max}
            value={year} 
            onChange={(e) => {
              const val = e.target.value;
              setYear(val === "" ? "" : Number(val));
            }}
            placeholder={String(initDate.getFullYear())}
            className="w-full h-12 min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
          />
        </div>
      </div>

      {/* Lower Row: Hour | Minute */}
      {showTime && (
      <div className="mt-1 grid w-full grid-cols-2 gap-2 sm:max-w-[260px] sm:gap-4">
        {/* HOUR */}
        <div className="flex min-w-0 flex-col">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Saat</label>
          <div className="relative">
            <select 
              value={hour} 
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full h-12 min-h-[48px] appearance-none rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 cursor-pointer text-center"
            >
              {HOURS.map((h, i) => (
                <option key={i} value={i}>{h}</option>
              ))}
            </select>
          </div>
        </div>
        {/* MINUTE */}
        <div className="flex min-w-0 flex-col">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Dakika</label>
          <div className="relative">
            <select 
              value={minute} 
              onChange={(e) => setMinute(Number(e.target.value))}
              className="w-full h-12 min-h-[48px] appearance-none rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20 cursor-pointer text-center"
            >
              {MINUTES.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
