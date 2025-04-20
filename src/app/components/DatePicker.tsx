'use client';

import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function DatePicker({ selectedDates, onChange, minDate = new Date(), maxDate }: DatePickerProps) {
  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    
    const isSelected = selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );
    
    if (isSelected) {
      onChange(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      onChange([...selectedDates, date]);
    }
  };

  return (
    <div className="react-datepicker-wrapper">
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          padding: 1rem;
        }
        .react-datepicker__current-month {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        .react-datepicker__day-name {
          color: #4b5563;
          font-weight: 500;
          width: 2.5rem;
          line-height: 2.5rem;
          margin: 0.2rem;
        }
        .react-datepicker__day {
          color: #1f2937;
          width: 2.5rem;
          line-height: 2.5rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          margin: 0.2rem;
        }
        .react-datepicker__day:hover {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .react-datepicker__day--selected {
          background-color: #2563eb !important;
          color: white !important;
          font-weight: 600;
        }
        .react-datepicker__day--disabled {
          color: #9ca3af;
        }
        .react-datepicker__navigation {
          top: 1rem;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #4b5563;
          border-width: 2px 2px 0 0;
        }
        .react-datepicker__month {
          margin: 0.4rem;
        }
      `}</style>
      <ReactDatePicker
        selected={null}
        onChange={handleDateClick}
        inline
        monthsShown={2}
        minDate={minDate}
        maxDate={maxDate}
        highlightDates={selectedDates}
        calendarClassName="!font-sans"
      />
      <div className="mt-4 text-sm text-gray-600">
        {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
