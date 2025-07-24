// Utility to format ISO date strings to browser-local date/time
export function formatLocalDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString();
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