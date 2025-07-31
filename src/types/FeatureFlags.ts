// Centralized type for all feature flags used in the app
// Add new flags here as needed
export interface FeatureFlags {
  superAdminAccess?: boolean;
  adminAccess?: boolean;
  dispatchAccess?: boolean;
  showRadioResources?: boolean;
  showAgencyResources?: boolean;
  showAssignmentBoard?: boolean;
  // Add more feature flags below as needed
}
