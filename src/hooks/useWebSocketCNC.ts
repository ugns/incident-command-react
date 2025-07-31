import { useEffect, useRef, useCallback } from 'react';

// Usage: const { send, connected } = useWebSocketCNC(token, onMessage)
// token: JWT from login
// onMessage: (msg: any) => void (handles CNC messages)

export function useWebSocketCNC(
  token: string | null,
  onMessage: (msg: any) => void
): { send: (data: any) => void; connected: boolean } {
  const wsRef = useRef<WebSocket | null>(null);
  const connected = useRef(false);

  // Send a message to the WS server
  const send = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const url = process.env.REACT_APP_WS_BASE_URL?.replace(/^http/, 'ws');
    if (!url) return;
    // Attach JWT as query param for $connect auth
    const wsUrl = `${url}?token=${token}`;
    const ws = new window.WebSocket(wsUrl);
    wsRef.current = ws;
    connected.current = false;

    ws.onopen = () => {
      connected.current = true;
      // Optionally send a ping on connect
      send({ action: 'ping' });
    };
    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (onMessage) onMessage(msg);
      } catch (e) {
        // Ignore malformed messages
      }
    };
    ws.onclose = () => {
      connected.current = false;
    };
    ws.onerror = () => {
      connected.current = false;
    };
    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, send, onMessage]);

  return { send, connected: connected.current };
}
