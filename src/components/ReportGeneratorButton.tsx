import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import ReportModal from './ReportModal';
import { ReportType } from '../types/ReportType';
import reportService from '../services/reportService';
import AppToast from './AppToast';
import { downloadBlob } from '../utils/download';

interface ReportGeneratorButtonProps {
  requiredReportType: string;
  token: string;
  user: any;
  buildReportData: (formData: { positionTitle: string }) => any;
  onReportGenerated?: (blob: Blob) => void;
  buttonText?: string;
  disabled?: boolean;
}

const ReportGeneratorButton: React.FC<ReportGeneratorButtonProps> = ({
  requiredReportType,
  token,
  user,
  buildReportData,
  onReportGenerated,
  buttonText = 'Generate Report',
  disabled
}) => {
  const [availableReportTypes, setAvailableReportTypes] = useState<ReportType[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [lastPositionTitle, setLastPositionTitle] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; bg: 'info' | 'danger' | 'success' }>({ show: false, message: '', bg: 'info' });

  const availableTypeObj = availableReportTypes.find(rt => rt.type === requiredReportType);
  const isReportTypeAvailable = !!availableTypeObj;

  useEffect(() => {
    const fetchReportTypes = async () => {
      if (!token) return;
      try {
        const types = await reportService.list(token);
        setAvailableReportTypes(types.reports);
      } catch (e) {
        setAvailableReportTypes([]);
      }
    };
    fetchReportTypes();
  }, [token, requiredReportType]);

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleReportModalSubmit = async (formData: { positionTitle: string }) => {
    setLastPositionTitle(formData.positionTitle);
    setShowReportModal(false);
    if (!user || !token) {
      setToast({ show: true, message: 'Missing required information to generate report.', bg: 'danger' });
      return;
    }
    if (!isReportTypeAvailable) {
      setToast({ show: true, message: 'Required report type is not available.', bg: 'danger' });
      return;
    }
    setGenerating(true);
    try {
      const report = buildReportData(formData);
      const mediaType = availableTypeObj.mediaType || 'application/pdf';
      const { blob, filename } = await reportService.generate(report, token, requiredReportType, mediaType);
      if (onReportGenerated) onReportGenerated(blob);
      downloadBlob(blob, filename || `${requiredReportType}.pdf`);
      setToast({ show: true, message: 'Report generated and downloaded successfully.', bg: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: 'Failed to generate report: ' + (err.message || err), bg: 'danger' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant="success"
        onClick={handleGenerateReport}
        disabled={generating || !isReportTypeAvailable || disabled}
        title={!isReportTypeAvailable ? 'Required report type is not available.' : undefined}
      >
        {buttonText}
      </Button>
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSubmit={handleReportModalSubmit}
        initialPositionTitle={lastPositionTitle}
        preparedByName={'' + (user?.name || '')}
        disableSubmit={!isReportTypeAvailable}
      />
      <AppToast
        show={toast.show}
        message={toast.message}
        bg={toast.bg}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </>
  );
};

export default ReportGeneratorButton;
