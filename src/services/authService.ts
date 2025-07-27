import { apiFetch } from '../api/api';
import { AuthContextType } from '../context/AuthContext';

type LoginResponse = Pick<AuthContextType, 'token' | 'user'>;

const authService = {
  loginWithGoogle: async (googleToken: string): Promise<LoginResponse> => {
    // Returns { token, user } or throws
    return apiFetch<LoginResponse>('/auth/login', 'POST', { token: googleToken, provider: 'google' });
  },
  // Future: add loginWithOtherProvider, etc.
};

export default authService;
