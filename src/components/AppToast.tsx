import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export interface AppToastProps {
  show: boolean;
  message: string | null;
  bg?: 'info' | 'danger' | 'success';
  onClose: () => void;
  delay?: number;
}

const AppToast: React.FC<AppToastProps> = ({ show, message, bg = 'info', onClose, delay = 3500 }) => (
  <ToastContainer position="top-end" className="p-3">
    <Toast show={!!message && show} onClose={onClose} autohide delay={delay} bg={bg}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  </ToastContainer>
);

export default AppToast;
