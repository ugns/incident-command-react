// Utility to format ISO date strings to browser-local date/time
export function formatLocalDateTime(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  // This will output MM/DD/YYYY, HH:mm in most browsers with these options
  return date.toLocaleString(undefined, options).replace(',', '');
}

// Convert ISO8601 to 'yyyy-MM-ddTHH:mm' for datetime-local input
export function isoToLocal(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  // Pad to 2 digits
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Convert 'yyyy-MM-ddTHH:mm' to ISO8601
export function toISO(local: string) {
  if (!local) return '';
  // local is 'YYYY-MM-DDTHH:mm', treat as local time, convert to UTC ISO8601
  const date = new Date(local);
  return date.toISOString();
};