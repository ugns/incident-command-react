import { Report } from '../types/Report';
import { ReportType } from '../types/ReportType';
import { apiFetch } from '../api/api';



const reportService = {
  async generate(report: Report, token: string, reportType: string, mediaType: string): Promise<Blob> {
    // Use dynamic endpoint and Accept header
    return apiFetch(`/reports/${reportType}`, 'POST', report, token, 'blob', mediaType);
  },

  async listTypes(token: string): Promise<{ reports: ReportType[] }> {
    return apiFetch('/reports', 'GET', undefined, token);
  },
};

export default reportService;
