import { useCallback, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';


// Usage: const { send, connected } = useWebSocketCNC(token, onMessage)
// token: JWT from login
// onMessage: (msg: any) => void (handles CNC messages)

export function useWebSocketCNC(
  token: string | null,
  onMessage: (msg: any) => void
): { send: (data: any) => void; connected: boolean } {
  // Memoize the WebSocket URL so it only changes when token changes
  const wsUrl = useMemo(() => {
    if (!token) return null;
    const url = process.env.REACT_APP_WS_BASE_URL?.replace(/^http/, 'ws');
    if (!url) return null;
    return `${url}?token=${token}`;
  }, [token]);

  const {
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(wsUrl, {
    onOpen: () => {
      // Optionally send a ping on connect
      sendJsonMessage({ action: 'ping' });
    },
    onMessage: (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (onMessage) onMessage(msg);
      } catch {
        // Ignore malformed messages
      }
    },
    shouldReconnect: () => true, // auto-reconnect on close
    retryOnError: true,
    // You can add more options as needed
  },
  // Only connect if token is present
  Boolean(wsUrl));

  // Send a message to the WS server
  const send = useCallback((data: any) => {
    sendJsonMessage(data);
  }, [sendJsonMessage]);

  // Connected if readyState is OPEN
  const connected = readyState === ReadyState.OPEN;

  return { send, connected };
}
