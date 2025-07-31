import { usePeriod } from '../context/PeriodContext';

export function usePeriods() {
  // Expose the full context for CRUD and selection
  return usePeriod();
}
