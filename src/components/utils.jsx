import { useState } from "react";

export const validateEmailOrMobile = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;
    return emailPattern.test(input) || mobilePattern.test(input);
};
  
export const validatePassword = (password) => {
    return password.length >= 3 ;
};

export const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|org|net|co|edu|gov|info)$/i;
    return emailPattern.test(email);
}

export const validateMobile = (mobile) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
}

export const validateNotEmpty = (text) => {
    return text.length >= 1;
}

export const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

  

export const modalSizes = {
    edit: { height: 'auto', width: '330px' },
    add: { height: '500px', width: '600px' },
    assign: { height: '400px', width: '500px' },
    delete: { height: 'auto', width: '400px' }
}

