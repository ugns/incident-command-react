import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Select from 'react-select';
import type { Period } from '../types/Period';
import { Button, Placeholder } from 'react-bootstrap';

interface OptionType {
  value: string;
  label: string;
}

interface PeriodSelectProps {
  periods: Period[];
  value: Period | null;
  onSelect: (period: Period | null) => void;
  loading?: boolean;
  allowNone?: boolean;
}

const PeriodSelect = forwardRef<{ reset: () => void }, PeriodSelectProps>(({ periods, value, onSelect, loading, allowNone }, ref) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  useEffect(() => {
    if (value) {
      setSelectedOption({ value: value.periodId, label: value.description });
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const options: OptionType[] = periods.map(p => ({
    value: p.periodId,
    label: p.description
  }));

  const handleChange = (opt: OptionType | null) => {
    setSelectedOption(opt);
    if (opt && opt.value) {
      const period = periods.find(p => p.periodId === opt.value);
      if (period) onSelect(period);
    } else {
      onSelect(null);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    onSelect(null);
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset
  }));

  return (
    <div className="d-flex align-items-center">
      <div className="flex-grow-1">
        {loading ? (
          <Placeholder as="div" animation="glow">
            <Placeholder xs={12} style={{ height: 38, marginBottom: 8 }} />
          </Placeholder>
        ) : (
          <Select
            options={options}
            value={selectedOption}
            onChange={handleChange}
            isClearable
            isSearchable
            placeholder="Type to filter periods..."
          />
        )}
      </div>
      {allowNone && (
        <Button
          variant="outline-secondary"
          className="ms-2"
          onClick={handleReset}
          disabled={loading && !selectedOption}
        >
          Reset
        </Button>
      )}
    </div>
  );
});

export default PeriodSelect;
