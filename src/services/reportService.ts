import { Report } from '../types/Report';
import { apiFetch } from '../api/api';

const reportService = {
  async generate(report: Report, token: string): Promise<Blob> {
    return apiFetch('/ics214/report', 'POST', report, token, 'blob');
  },
};

export default reportService;
