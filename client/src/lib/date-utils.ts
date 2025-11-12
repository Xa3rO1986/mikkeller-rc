// Utility functions for date formatting in Russian

const monthsGenitive = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const monthsNominative = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

/**
 * Format date in Russian with genitive case for months
 * @param date - Date object or string
 * @param options - Formatting options
 * @returns Formatted date string (e.g., "10 января 2025")
 */
export function formatRussianDate(
  date: Date | string,
  options: {
    includeYear?: boolean;
    includeTime?: boolean;
    uppercase?: boolean;
    useNominative?: boolean;
  } = {}
): string {
  const {
    includeYear = true,
    includeTime = false,
    uppercase = false,
    useNominative = false,
  } = options;

  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();

  const months = useNominative ? monthsNominative : monthsGenitive;
  let month = months[monthIndex];

  if (uppercase) {
    month = month.toUpperCase();
  }

  let result = `${day} ${month}`;

  if (includeYear) {
    result += ` ${year}`;
  }

  if (includeTime) {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    result += ` в ${hours}:${minutes}`;
  }

  return result;
}

/**
 * Get just the month name in genitive case
 * @param date - Date object or string
 * @param uppercase - Whether to uppercase the month
 * @returns Month name (e.g., "января" or "ЯНВАРЯ")
 */
export function formatRussianMonth(
  date: Date | string,
  uppercase: boolean = false
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const monthIndex = d.getMonth();
  const month = monthsGenitive[monthIndex];
  return uppercase ? month.toUpperCase() : month;
}
