import { usePeriod } from '../context/PeriodContext';

export function usePeriods() {
  const { periods, loading, error, refresh } = usePeriod();
  return { periods, loading, error, refresh };
}
