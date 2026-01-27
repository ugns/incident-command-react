import type { Report } from '../types/Report';
import type { ReportType } from '../types/ReportType';

export type CrudService<T> = {
  list: (token: string, onAuthError?: () => void) => Promise<T[]>;
  create: (data: Partial<T>, token: string, onAuthError?: () => void) => Promise<T>;
  update: (id: string, data: Partial<T>, token: string, onAuthError?: () => void) => Promise<T>;
  delete: (id: string, token: string, onAuthError?: () => void) => Promise<void>;
  export?: (token: string, onAuthError?: () => void) => Promise<ExportResult>;
  import?: (file: File, token: string, onAuthError?: () => void) => Promise<ImportResult>;
};

export type ExportResult = {
  blob: Blob;
  filename?: string;
};

export type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors?: unknown[];
};

export type ReportService = {
  list: (token: string, onAuthError?: () => void) => Promise<{ reports: ReportType[] }>;
  generate: (
    data: Report,
    token: string,
    reportType: string,
    mediaType: string,
    onAuthError?: () => void
  ) => Promise<ExportResult>;
};
