const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function apiFetch<T>(options: {
  path: string;
  method?: string;
  body?: any;
  token?: string;
  responseType?: 'json' | 'blob';
  accept?: string;
  onAuthError?: () => void;
  json?: boolean;
  contentType?: string;
}): Promise<T> {
  const {
    path,
    method = 'GET',
    body,
    token,
    responseType = 'json',
    accept,
    onAuthError,
    json = true,
    contentType,
  } = options;
  const headers: Record<string, string> = {
    'Accept': accept ? accept : 'application/json',
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  } else if (body !== undefined && json) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : (json ? JSON.stringify(body) : body),
  });
  if (!resp.ok) {
    if (resp.status === 403 && onAuthError) {
      onAuthError();
    }
    const errorBody = await resp.text();
    const message = errorBody || resp.statusText || 'Request failed';
    const error = new Error(`${resp.status}: ${message}`);
    throw error;
  }
  if (resp.status === 204) return null as T; // No content
  if (responseType === 'blob') {
    const blob = await resp.blob();
    let filename: string | undefined;
    const disposition = resp.headers.get('Content-Disposition');
    if (disposition) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match) filename = match[1];
    }
    return { blob, filename } as T;
  }
  return resp.json();
}
