import { usePeriod } from '../context/PeriodContext';

export function usePeriods() {
  const { periods, loading, error, refreshPeriods } = usePeriod();
  return { periods, loading, error, refresh: refreshPeriods };
}
