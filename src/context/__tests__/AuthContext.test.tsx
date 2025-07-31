import { render, screen } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext';

describe('AuthContext', () => {
  it('provides default values', () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {value => {
            contextValue = value;
            return <span>test</span>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(contextValue).toBeDefined();
  });
});
