const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function apiFetch<T>(
  path: string,
  method: string = 'GET',
  body?: any,
  token?: string,
  responseType: 'json' | 'blob' = 'json',
  accept?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': accept ? accept : 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) throw new Error(await resp.text());
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
