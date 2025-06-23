// src/components/admin/analytics/DateRangePicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  // Presets for common date ranges
  const presets = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Year to date', value: 'ytd' },
  ];

  // Handle preset selection
  const handlePresetClick = (preset: { label: string; value: number | string }) => {
    const today = new Date();
    
    if (preset.value === 'ytd') {
      // Year to date - from Jan 1 to today
      const from = new Date(today.getFullYear(), 0, 1); // January 1st of current year
      onChange({ from, to: today });
    } else if (typeof preset.value === 'number') {
      // Last n days
      const from = new Date();
      from.setDate(from.getDate() - preset.value);
      onChange({ from, to: today });
    }
  };

  // Format the displayed date range
  const formatDateRange = (range: DateRange) => {
    if (range.from && range.to) {
      return `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[240px] justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="border-r p-3 space-y-2">
            <div className="text-sm font-medium px-1 mb-2">Quick select</div>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.from}
            selected={value}
            onSelect={onChange as any}
            numberOfMonths={2}
            className="p-3"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}