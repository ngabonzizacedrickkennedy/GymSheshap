// src/lib/dateUtils.ts

/**
 * Formats a date as a string with the specified format.
 * This is a simple implementation - for more complex formatting,
 * consider using a library like date-fns
 */
export function formatDate(date: Date | null | undefined): string {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  /**
   * Gets the start of the current month
   */
  export function startOfMonth(date: Date = new Date()): Date {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  }
  
  /**
   * Gets the end of the current month
   */
  export function endOfMonth(date: Date = new Date()): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
  }
  
  /**
   * Gets a date that is X days in the past from the given date
   */
  export function subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
  
  /**
   * Gets a date that is X days in the future from the given date
   */
  export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  /**
   * Gets the start of the current year
   */
  export function startOfYear(date: Date = new Date()): Date {
    const result = new Date(date);
    result.setMonth(0, 1);
    result.setHours(0, 0, 0, 0);
    return result;
  }
  
  /**
   * Determines if two dates are the same day
   */
  export function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  /**
   * Format a date range as a string
   */
  export function formatDateRange(from: Date | null, to: Date | null): string {
    if (!from && !to) return 'All time';
    if (!from) return `Until ${formatDate(to)}`;
    if (!to) return `From ${formatDate(from)}`;
    
    return `${formatDate(from)} - ${formatDate(to)}`;
  }