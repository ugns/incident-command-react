import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import { Placeholder } from 'react-bootstrap';
import { Organization } from '../types/Organization';
import organizationService from '../services/organizationService';
import OrganizationForm from '../pages/OrganizationForm';

interface OptionType {
  value: string;
  label: string;
}

interface OrganizationSelectProps {
  value: Organization | null;
  onSelect: (organization: Organization) => void;
  organizations: Organization[];
  onOrganizationAdded?: () => void;
}

const OrganizationSelect = forwardRef<{ reset: () => void }, OrganizationSelectProps>(({ value, onSelect, organizations, onOrganizationAdded }, ref) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingOrganization, setPendingOrganization] = useState<string>('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    if (value) {
      setSelectedOption({ value: value.org_id, label: value.name });
    } else {
      setSelectedOption(null);
    }
  }, [value]);

  const options: OptionType[] = organizations.map(o => ({
    value: o.org_id,
    label: o.name
  }));

  const handleChange = (opt: OptionType | null) => {
    setSelectedOption(opt);
    if (opt) {
      const organization = organizations.find(o => o.org_id === opt.value);
      if (organization) onSelect(organization);
    } else {
      onSelect(null as any);
    }
  };

  // Only set pendingOrganization on input, do not open modal automatically
  const handleInputChange = (input: string) => {
    setPendingOrganization(input.trim());
  };

  const handleAddOrganization = async (formData: any) => {
    setLoading(true);
    const token = localStorage.getItem('token') || '';
    try {
      await organizationService.create(formData, token);
      // Parent will handle selection after refresh
      setShowAddModal(false);
      setPendingOrganization('');
      if (onOrganizationAdded) onOrganizationAdded();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    onSelect(null as any);
    setPendingOrganization('');
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
            placeholder="Type to filter organizations..."
            noOptionsMessage={({ inputValue }) => (
              inputValue.trim() ? (
                <span>
                  Organization not found. <Button variant="link" size="sm" onClick={() => { setShowAddModal(true); setPendingOrganization(inputValue.trim()); }}>Add Organization</Button>
                </span>
              ) : 'No organizations found'
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
      <OrganizationForm
        show={showAddModal}
        onHide={() => { setShowAddModal(false); setPendingOrganization(''); }}
        onSubmit={handleAddOrganization}
        initial={pendingOrganization ? { name: pendingOrganization } : undefined}
      />
    </div>
  );
});

export default OrganizationSelect;
