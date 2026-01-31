import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import ReportModal from './ReportModal';
import { ReportType } from '../types/ReportType';
import reportService from '../services/reportService';
import AppToast from './AppToast';
import { downloadBlob } from '../utils/download';

type ReportGeneratorModalProps<FormData> = {
  show: boolean;
  onHide: () => void;
  onSubmit: (formData: FormData) => void;
  initialFormData?: FormData;
  disableSubmit?: boolean;
  user: any;
};

type DefaultFormData = { positionTitle: string };

type BaseReportGeneratorButtonProps<FormData> = {
  requiredReportType: string;
  token: string;
  user: any;
  buildReportData: (formData: FormData) => any;
  getGenerateOptions?: (formData: FormData) => { json?: boolean; contentType?: string };
  onReportGenerated?: (blob: Blob) => void;
  buttonText?: string;
  disabled?: boolean;
  defaultFormData?: FormData;
};

type DefaultModalProps = BaseReportGeneratorButtonProps<DefaultFormData> & {
  renderModal?: undefined;
  modalEnabled?: true;
};

type CustomModalProps<FormData> = BaseReportGeneratorButtonProps<FormData> & {
  renderModal: (props: ReportGeneratorModalProps<FormData>) => React.ReactNode;
  modalEnabled?: true;
};

type NoModalProps<FormData> = BaseReportGeneratorButtonProps<FormData> & {
  modalEnabled: false;
  defaultFormData: FormData;
  renderModal?: undefined;
};

type ReportGeneratorButtonProps<FormData> =
  | DefaultModalProps
  | CustomModalProps<FormData>
  | NoModalProps<FormData>;

function useReportGenerator<FormData>(props: BaseReportGeneratorButtonProps<FormData>) {
  const {
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    defaultFormData,
  } = props;
  const [availableReportTypes, setAvailableReportTypes] = useState<ReportType[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [lastFormData, setLastFormData] = useState<FormData | undefined>(defaultFormData);
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

  const handleGenerate = async (formData: FormData) => {
    setLastFormData(formData);
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
      const generateOptions = getGenerateOptions ? getGenerateOptions(formData) : undefined;
      const mediaType = availableTypeObj?.mediaType || 'application/pdf';
      const { blob, filename } = await reportService.generate(report, token, requiredReportType, mediaType, undefined, generateOptions);
      if (onReportGenerated) onReportGenerated(blob);
      downloadBlob(blob, filename || `${requiredReportType}.pdf`);
      setToast({ show: true, message: 'Report generated and downloaded successfully.', bg: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: 'Failed to generate report: ' + (err.message || err), bg: 'danger' });
    } finally {
      setGenerating(false);
    }
  };

  return {
    availableTypeObj,
    isReportTypeAvailable,
    showReportModal,
    setShowReportModal,
    lastFormData,
    setLastFormData,
    generating,
    toast,
    setToast,
    handleGenerate,
  };
}

function ReportGeneratorButton(props: DefaultModalProps): React.ReactElement;
function ReportGeneratorButton<FormData>(props: CustomModalProps<FormData> | NoModalProps<FormData>): React.ReactElement;
function ReportGeneratorButton<FormData>(props: ReportGeneratorButtonProps<FormData>): React.ReactElement {
  if (props.modalEnabled === false) {
    return <NoModalReportGenerator {...props} />;
  }
  if (props.renderModal) {
    return <CustomModalReportGenerator {...props} />;
  }
  return <DefaultModalReportGenerator {...props} />;
}

function DefaultModalReportGenerator(props: DefaultModalProps) {
  const {
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    buttonText = 'Generate Report',
    disabled,
    defaultFormData,
  } = props;
  const {
    isReportTypeAvailable,
    showReportModal,
    setShowReportModal,
    lastFormData,
    generating,
    toast,
    setToast,
    handleGenerate,
  } = useReportGenerator<DefaultFormData>({
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    defaultFormData,
    buttonText,
    disabled,
  });

  return (
    <>
      <Button
        variant="success"
        onClick={() => setShowReportModal(true)}
        disabled={generating || !isReportTypeAvailable || disabled}
        title={!isReportTypeAvailable ? 'Required report type is not available.' : undefined}
      >
        {buttonText}
      </Button>
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSubmit={handleGenerate}
        initialPositionTitle={lastFormData?.positionTitle || ''}
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
}

function CustomModalReportGenerator<FormData>(props: CustomModalProps<FormData>) {
  const {
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    buttonText = 'Generate Report',
    disabled,
    defaultFormData,
    renderModal,
  } = props;
  const {
    isReportTypeAvailable,
    showReportModal,
    setShowReportModal,
    lastFormData,
    generating,
    toast,
    setToast,
    handleGenerate,
  } = useReportGenerator<FormData>({
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    defaultFormData,
    buttonText,
    disabled,
  });

  return (
    <>
      <Button
        variant="success"
        onClick={() => setShowReportModal(true)}
        disabled={generating || !isReportTypeAvailable || disabled}
        title={!isReportTypeAvailable ? 'Required report type is not available.' : undefined}
      >
        {buttonText}
      </Button>
      {renderModal({
        show: showReportModal,
        onHide: () => setShowReportModal(false),
        onSubmit: handleGenerate,
        initialFormData: lastFormData ?? defaultFormData,
        disableSubmit: !isReportTypeAvailable,
        user,
      })}
      <AppToast
        show={toast.show}
        message={toast.message}
        bg={toast.bg}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </>
  );
}

function NoModalReportGenerator<FormData>(props: NoModalProps<FormData>) {
  const {
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    buttonText = 'Generate Report',
    disabled,
    defaultFormData,
  } = props;
  const {
    isReportTypeAvailable,
    generating,
    toast,
    setToast,
    handleGenerate,
  } = useReportGenerator<FormData>({
    requiredReportType,
    token,
    user,
    buildReportData,
    getGenerateOptions,
    onReportGenerated,
    defaultFormData,
    buttonText,
    disabled,
  });

  return (
    <>
      <Button
        variant="success"
        onClick={() => handleGenerate(defaultFormData)}
        disabled={generating || !isReportTypeAvailable || disabled}
        title={!isReportTypeAvailable ? 'Required report type is not available.' : undefined}
      >
        {buttonText}
      </Button>
      <AppToast
        show={toast.show}
        message={toast.message}
        bg={toast.bg}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </>
  );
}

export default ReportGeneratorButton;
