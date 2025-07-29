import { Report } from '../types/Report';
import { ReportType } from '../types/ReportType';
import { apiFetch } from '../api/api';
import { REPORTS_BASE } from '../constants/apis';

const API_BASE = REPORTS_BASE;

const reportService = {
  async list(token: string, onAuthError?: () => void): Promise<{ reports: ReportType[] }> {
    return apiFetch<{ reports: ReportType[] }>({
      path: `${API_BASE}`,
      token,
      onAuthError,
    });
  },

  // No get, create, update, or delete methods for reports

  async generate(data: Report, token: string, reportType: string, mediaType: string, onAuthError?: () => void): Promise<{ blob: Blob; filename?: string }> {
    return apiFetch<{ blob: Blob; filename?: string }>({
      path: `${API_BASE}/${reportType}`,
      method: 'POST',
      body: data,
      token,
      responseType: 'blob',
      accept: mediaType,
      onAuthError,
    });
  },
};

export default reportService;
