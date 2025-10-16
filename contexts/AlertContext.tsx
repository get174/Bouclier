
import React, { createContext, useState, useContext, ReactNode } from 'react';
import CustomAlert, { AlertType } from '../components/CustomAlert';

interface AlertContextData {
  showAlert: (title: string, message: string, type?: AlertType) => void;
}

interface AlertProviderProps {
  children: ReactNode;
}

const AlertContext = createContext<AlertContextData | undefined>(undefined);

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('success');

  const showAlert = (alertTitle: string, alertMessage: string, alertType: AlertType = 'success') => {
    setTitle(alertTitle);
    setMessage(alertMessage);
    setType(alertType);
    setIsVisible(true);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        isVisible={isVisible}
        onClose={onClose}
        title={title}
        message={message}
        type={type}
      />
    </AlertContext.Provider>
  );
};

export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useCustomAlert must be used within an AlertProvider');
  }
  return context;
};
