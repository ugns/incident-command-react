import { Report } from '../types/Report';
import { ReportType } from '../types/ReportType';
import { apiFetch } from '../api/api';



const reportService = {
  async generate(report: Report, token: string, reportType: string, mediaType: string): Promise<{ blob: Blob; filename?: string }> {
    const response = await apiFetch<{ blob: Blob; filename?: string }>(`/reports/${reportType}`, 'POST', report, token, 'blob', mediaType);
    return response;
  },

  async listTypes(token: string): Promise<{ reports: ReportType[] }> {
    return apiFetch('/reports', 'GET', undefined, token);
  },
};

export default reportService;
