import { apiFetch } from '../api/api';
import { AuthContextType } from '../context/AuthContext';

type LoginResponse = Pick<AuthContextType, 'token' | 'user'>;

const API_BASE = '/auth';

const authService = {
  loginWithGoogle: async (googleToken: string, onAuthError?: () => void): Promise<LoginResponse> => {
    // Returns { token, user } or throws
    return apiFetch<LoginResponse>({
      path: `${API_BASE}/login`,
      method: 'POST',
      body: { token: googleToken, provider: 'google' },
      onAuthError,
    });
  },
  // Future: add loginWithOtherProvider, etc.
};

export default authService;
