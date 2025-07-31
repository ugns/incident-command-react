import { render } from '@testing-library/react';
import { useWebSocketCNC } from '../useWebSocketCNC';

function TestComponent({ token, onMessage }: { token: string; onMessage: (msg: any) => void }) {
  const { send, connected } = useWebSocketCNC(token, onMessage);
  return (
    <div>
      <span data-testid="connected">{String(connected)}</span>
      <button data-testid="send" onClick={() => send({ test: true })}>Send</button>
    </div>
  );
}

describe('useWebSocketCNC', () => {
  it('returns send and connected', () => {
    const onMessage = jest.fn();
    const { getByTestId } = render(<TestComponent token="fake-token" onMessage={onMessage} />);
    expect(getByTestId('connected')).toBeInTheDocument();
    expect(getByTestId('send')).toBeInTheDocument();
  });
});
