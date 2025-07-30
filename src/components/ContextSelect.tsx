import React, { useMemo } from 'react';
import Select from 'react-select';
import { Placeholder } from 'react-bootstrap';

interface ContextSelectProps<T> {
  label: string;
  options: T[];
  value: string | null;
  onSelect: (id: string | null) => void;
  loading?: boolean;
  disabled?: boolean;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
}

function ContextSelect<T>({
  label,
  options,
  value,
  onSelect,
  loading,
  disabled,
  getOptionLabel,
  getOptionValue,
}: ContextSelectProps<T>) {

  // Memoize react-select options, guard against undefined options
  const selectOptions = useMemo(() => {
    const safeOptions = options || [];
    return safeOptions.map(option => ({
      value: getOptionValue(option),
      label: getOptionLabel(option),
    }));
  }, [options, getOptionLabel, getOptionValue]);

  const selectedOption = selectOptions.find(opt => opt.value === value) || null;

  const handleChange = (opt: { value: string; label: string } | null) => {
    onSelect(opt ? opt.value : null);
  };

  return (
    <div className="mb-3">
      <label>{`Select ${label}`}</label>
      {loading ? (
        <Placeholder as="div" animation="glow">
          <Placeholder xs={12} style={{ height: 38, marginBottom: 8 }} />
        </Placeholder>
      ) : (
        <Select
          options={selectOptions}
          value={selectedOption}
          onChange={handleChange}
          isClearable
          isSearchable
          placeholder={`Type to filter ${label.toLowerCase()}s...`}
          isDisabled={disabled}
        />
      )}
    </div>
  );
}

export default ContextSelect;
