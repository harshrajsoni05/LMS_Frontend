import '../styles/LoginForm.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import '../styles/LoginForm.css'

import Toast from './toast/toast';

import { login } from '../api/Auth';
import { loginUser } from '../redux/authActions';
import { validateEmailOrMobile, validatePassword } from '../components/utils';

const initialErrors = {
  username: '',
  password: ''
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState(initialErrors);

  const showSuccessToast = (message) => {
    setToastType('success');
    setToastMessage(message);
    setShowToast(true);
  };

  const showFailureToast = (message) => {
    setToastType('failure');
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    if (auth && auth.jwtToken) {
      if (auth.role === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/userhistory');
      }
    }
  }, [auth, navigate]);

  const validateLogin = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!validateEmailOrMobile(username)) {
      newErrors.username = 'Enter a valid email or mobile number.';
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Please enter a valid Password';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
    }

    return isValid;
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (field === 'username' && !validateEmailOrMobile(username)) {
      newErrors.username = 'Enter a valid email or mobile number.';
    } else if (field === 'password' && !validatePassword(password)) {
      newErrors.password = 'Please enter a valid Password';
    } else {
      newErrors[field] = '';
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) {
      return;
    }

    try {
      const EncodedPassword = btoa(password);
      const { data } = await login(username, EncodedPassword);
      dispatch(loginUser(data));
      window.localStorage.setItem('jwtToken', data.jwtToken);
      showSuccessToast('Login Successful!');
    } catch (error) {
      showFailureToast('Invalid Credentials');
      console.log(error);
    }
  };

  return (
    <div className="login-form">
      <h2>Welcome to ShelfHive</h2>
      <p>Enter your Credentials</p>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label htmlFor="username" className="visually-hidden"></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur('username')}
            placeholder="Email or Phone Number"
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password" className="visually-hidden"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="Password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          Login
        </button>
      </form>
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LoginForm;
