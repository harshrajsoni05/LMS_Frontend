
import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration); 
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastIcon = () => {
    if (type === 'success') {
      return '✅'; 
    }
    return '❌';
  };

  return (
    <div className={`toast toast-${type} toast-show`}>
      <div className="toast-icon">{getToastIcon()}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};



export default Toast;
