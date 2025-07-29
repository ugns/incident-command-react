import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import { Placeholder } from 'react-bootstrap';
import { Volunteer } from '../types/Volunteer';
import volunteerService from '../services/volunteerService';
import VolunteerForm from '../pages/Volunteers/VolunteerForm';

interface OptionType {
  value: string;
  label: string;
}

interface VolunteerSelectProps {
  value: Volunteer | null;
  onSelect: (volunteer: Volunteer) => void;
  volunteers: Volunteer[];
  onVolunteerAdded?: () => void;
}

const VolunteerSelect = forwardRef<{ reset: () => void }, VolunteerSelectProps>(({ value, onSelect, volunteers, onVolunteerAdded }, ref) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingVolunteer, setPendingVolunteer] = useState<string>('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    if (value) {
      setSelectedOption({ value: value.volunteerId, label: value.name });
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const options: OptionType[] = volunteers.map(v => ({
    value: v.volunteerId,
    label: v.name + (v.callsign ? ` (${v.callsign})` : '')
  }));

  const handleChange = (opt: OptionType | null) => {
    setSelectedOption(opt);
    if (opt) {
      const volunteer = volunteers.find(v => v.volunteerId === opt.value);
      if (volunteer) onSelect(volunteer);
    } else {
      onSelect(null as any);
    }
  };

  // Only set pendingVolunteer on input, do not open modal automatically
  const handleInputChange = (input: string) => {
    setPendingVolunteer(input.trim());
  };

  const handleAddVolunteer = async (formData: any) => {
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    try {
      await volunteerService.create(formData, token);
      // Parent will handle selection after refresh
      setShowAddModal(false);
      setPendingVolunteer('');
      if (onVolunteerAdded) onVolunteerAdded();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    onSelect(null as any);
    setPendingVolunteer('');
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
            onInputChange={handleInputChange}
            isClearable
            isSearchable
            placeholder="Type to filter volunteers..."
            noOptionsMessage={({ inputValue }) => (
              inputValue.trim() ? (
                <span>
                  Volunteer not found. <Button variant="link" size="sm" onClick={() => { setShowAddModal(true); setPendingVolunteer(inputValue.trim()); }}>Add Volunteer</Button>
                </span>
              ) : 'No volunteers found'
            )}
          />
        )}
      </div>
      <Button
        variant="outline-secondary"
        className="ms-2"
        onClick={handleReset}
        disabled={loading && !selectedOption}
      >
        Reset
      </Button>
      <VolunteerForm
        show={showAddModal}
        onHide={() => { setShowAddModal(false); setPendingVolunteer(''); }}
        onSubmit={handleAddVolunteer}
        initial={pendingVolunteer ? { name: pendingVolunteer } : undefined}
      />
    </div>
  );
});

export default VolunteerSelect;
