import { Report } from '../types/Report';
import { ReportType } from '../types/ReportType';
import { apiFetch } from '../api/api';



const reportService = {
  async generate(report: Report, token: string, reportType: string, mediaType: string, onAuthError?: () => void): Promise<{ blob: Blob; filename?: string }> {
    return apiFetch<{ blob: Blob; filename?: string }>({
      path: `/reports/${reportType}`,
      method: 'POST',
      body: report,
      token,
      responseType: 'blob',
      accept: mediaType,
      onAuthError,
    });
  },

  async listTypes(token: string, onAuthError?: () => void): Promise<{ reports: ReportType[] }> {
    return apiFetch<{ reports: ReportType[] }>({
      path: '/reports',
      token,
      onAuthError,
    });
  },
};

export default reportService;
