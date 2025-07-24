const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Download ICS214 PDF for a period
export async function downloadPeriodPDF(periodId: string, token: string) {
  const resp = await fetch(`${API_BASE_URL}/ics214/report/${periodId}?pdf=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error('Failed to fetch PDF');
  const blob = await resp.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ICS214-${periodId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function apiFetch<T>(
  path: string,
  method: string = 'GET',
  body?: any,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) throw new Error(await resp.text());
  if (resp.status === 204) return null as T; // No content
  return resp.json();
}
