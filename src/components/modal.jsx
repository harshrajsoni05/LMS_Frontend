import React from 'react';
import '../styles/Modal.css';

const Modal = ({ isOpen, onClose, children, height, width }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content" 
        style={{ height: height || 'auto', width: width || 'auto' }}
      >
        <button className="modal-close" onClick={onClose}> 
          &times; 
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
