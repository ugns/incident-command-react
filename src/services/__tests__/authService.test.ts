import authService from '../authService';

describe('authService', () => {
  it('should export loginWithGoogle function', () => {
    expect(typeof authService.loginWithGoogle).toBe('function');
  });
});
