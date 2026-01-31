import { Report } from '../types/Report';
import { ReportType } from '../types/ReportType';
import { apiFetch } from '../api/api';
import { REPORTS_BASE } from '../constants/apis';
import type { ExportResult, ReportService } from './types';

const API_BASE = REPORTS_BASE;

const reportService: ReportService = {
  async list(token: string, onAuthError?: () => void): Promise<{ reports: ReportType[] }> {
    return apiFetch<{ reports: ReportType[] }>({
      path: `${API_BASE}`,
      token,
      onAuthError,
    });
  },

  // No get, create, update, or delete methods for reports

  async generate(
    data: Report | File | FormData,
    token: string,
    reportType: string,
    mediaType: string,
    onAuthError?: () => void,
    options?: { json?: boolean; contentType?: string }
  ): Promise<ExportResult> {
    return apiFetch<ExportResult>({
      path: `${API_BASE}/${reportType}`,
      method: 'POST',
      body: data,
      token,
      responseType: 'blob',
      accept: mediaType,
      onAuthError,
      json: options?.json ?? true,
      contentType: options?.contentType,
    });
  },
};

export default reportService;
