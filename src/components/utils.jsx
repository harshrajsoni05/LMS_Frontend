export const validateEmailOrMobile = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;
    return emailPattern.test(input) || mobilePattern.test(input);
};
  
export const validatePassword = (password) => {
    return password.length >= 3 ;
};

export const validateEmail = (email) => {
    const emailPattern =  /^ [^\s@] + @[^\s@] + \.(com|org|net|co|edu|gov|info)$/i;
    return emailPattern.test(email);
}

export const validateMobile = (mobile) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
}

export const validateNotEmpty = (text) => {
    return text.length >= 1;
}

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const offset = 5.5 * 60; 
    const localTime = new Date(date.getTime() + (offset - date.getTimezoneOffset()) * 60000);

    const year = localTime.getFullYear();
    const month = String(localTime.getMonth() + 1).padStart(2, '0');
    const day = String(localTime.getDate()).padStart(2, '0');
    const hours = String(localTime.getHours()).padStart(2, '0');
    const minutes = String(localTime.getMinutes()).padStart(2, '0');
    const seconds = String(localTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

  

export const modalSizes = {
    edit: { height: 'auto', width: '280px' },
    add: { height: '500px', width: '600px' },
    assign: { height: '400px', width: '500px' },
    delete: { height: 'auto', width: '400px' }
}

