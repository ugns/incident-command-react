import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import type { ImportResult } from '../services/types';

type ImportModalProps = {
  show: boolean;
  title: string;
  busy: boolean;
  onHide: () => void;
  onImport: (file: File) => Promise<ImportResult>;
};

const ImportModal: React.FC<ImportModalProps> = ({ show, title, busy, onHide, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const handleClose = () => {
    if (busy) return;
    setFile(null);
    setError(null);
    setResult(null);
    setShowErrors(false);
    onHide();
  };

  const handleSubmit = async () => {
    if (!file || busy) return;
    setError(null);
    setResult(null);
    try {
      const res = await onImport(file);
      // eslint-disable-next-line no-console
      console.log('[ImportModal] Import result:', res);
      setResult(res);
      setShowErrors(false);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.log('[ImportModal] Import error:', err);
      setError(err?.message || 'Import failed');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton={!busy}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="importFile" className="mb-3">
          <Form.Label>CSV file</Form.Label>
          <Form.Control
            type="file"
            accept=".csv,text/csv"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files?.[0] ?? null)}
            disabled={busy}
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        {result && (
          <Alert variant={result.errors && result.errors.length ? 'warning' : 'success'}>
            Imported: {result.created} created, {result.updated} updated, {result.skipped} skipped.
            {result.errors && result.errors.length > 0 && (
              <div className="mt-2">
                <div className="d-flex align-items-center gap-2">
                  <span>Errors: {result.errors.length}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowErrors(prev => !prev)}
                  >
                    {showErrors ? 'Hide details' : 'Show details'}
                  </Button>
                </div>
                {showErrors && Array.isArray(result.errors) && (
                  <div className="mt-2" style={{ maxHeight: 240, overflow: 'auto' }}>
                    <table className="table table-sm mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: 80 }}>Row</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((err: any, idx: number) => (
                          <tr key={idx}>
                            <td>{err?.row ?? '-'}</td>
                            <td>{err?.error ?? String(err)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={busy}>Close</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!file || busy}>
          {busy ? 'Importing…' : 'Import'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
