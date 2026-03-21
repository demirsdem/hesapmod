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

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function BirthDatePicker({ onChange, defaultValue }: BirthDatePickerProps) {
  // Enforce the default value based on props or user's requested default
  const [initDate] = useState(() => {
    if (defaultValue && !isNaN(defaultValue.getTime())) {
      return defaultValue;
    }
    return new Date(1990, 0, 1, 12, 0);
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
  const safeYear = typeof year === "number" ? year : 1990;
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
    const safeY = typeof year === "number" ? year : 1990;
    const selectedDate = new Date(safeY, month, day, hour, minute);
    onChange(selectedDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year, hour, minute]);

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-50/50 p-4 rounded-xl border border-slate-100">
      <div className="text-sm font-semibold text-slate-700">
        Doğum Tarihi ve Saati
      </div>
      
      {/* Upper Row: Day | Month | Year */}
      <div className="flex flex-row justify-between gap-2 sm:gap-4 w-full">
        {/* DAY */}
        <div className="flex flex-col flex-1 min-w-[70px]">
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
        <div className="flex flex-col flex-[1.2] min-w-[90px]">
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
        <div className="flex flex-col flex-1 min-w-[80px]">
          <label className="text-xs text-slate-500 font-medium mb-1.5 ml-1">Yıl</label>
          <input 
            type="number"
            min={1924}
            max={2010}
            value={year} 
            onChange={(e) => {
              const val = e.target.value;
              setYear(val === "" ? "" : Number(val));
            }}
            placeholder="1990"
            className="w-full h-12 min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-[16px] text-slate-900 shadow-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20"
          />
        </div>
      </div>

      {/* Lower Row: Hour | Minute */}
      <div className="flex flex-row justify-start gap-2 sm:gap-4 w-full mt-1">
        {/* HOUR */}
        <div className="flex flex-col w-[100px] sm:w-[120px]">
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
        <div className="flex flex-col justify-end pb-3 text-slate-400 font-bold">:</div>
        {/* MINUTE */}
        <div className="flex flex-col w-[100px] sm:w-[120px]">
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
    </div>
  );
}
