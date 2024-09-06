import '../styles/LoginForm.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// CSS
import '../styles/LoginForm.css'

// Components
import CustomButton from '../components/button'
import Toast from './toast/toast';

// Functions
import { login } from '../api/Auth'
import { loginUser } from '../redux/authActions'
import { validateEmailOrMobile, validatePassword } from '../components/utils'





const initialErrors = {
  username: '',
  password: ''
}

const LoginForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(state => state.auth);

  const [role, setRoleState] = useState('user'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [placeholderText, setPlaceholderText] = useState("Enter Phone Number");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
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

  const [errors, setErrors] = useState(initialErrors);

  useEffect (() => {
    if (auth && auth.jwtToken) {
      if (auth.role === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/userhistory');
      }
    }
  }, [auth]);

  const validateLogin = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };
  
    if (!validateEmailOrMobile(username)) {
      newErrors.username = 'Enter a valid email or mobile number.';
      isValid = false;
    }
  
    if (!validatePassword(password)) {
      newErrors.password = "Please enter a valid Password";
      isValid = false;
    }
  
    if (!isValid) {
      setErrors(newErrors);
    }
  
    return isValid;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) {
      return;
    }

    try {
      const { data } = await login(username, password);
      dispatch(loginUser(data));
      window.localStorage.setItem('jwtToken', data.jwtToken);
      showSuccessToast("Login Successful!");

    } catch (error) {
      setErrors(error);
      showFailureToast("Invalid Credentials")
      console.log(error);
    }

  }


  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Enter Email" : "Enter Phone Number");
  }, [role]);



  const handleRoleChange = (event) => {
    setRoleState(event.target.value);
    setUsername("");
    setPassword("");
  };


  return (
    <div className="login-form">
      <h2>Welcome to ShelfHive </h2>
      <form onSubmit={handleSubmit}>
        <div className="role-selection">
          <input
            type="radio"
            id="user"
            name="role"
            value="user"
            checked={role === 'user'}
            onChange={handleRoleChange}
          />
          <input
            type="radio"
            id="admin"
            name="role"
            value="admin"
            checked={role === 'admin'}
            onChange={handleRoleChange}
          />
          <div className="switch">
            <label htmlFor="user" className="switch-label">User</label>
            <div className="slider"></div>
            <label htmlFor="admin" className="switch-label">Admin</label>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="username" className="visually-hidden"></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={placeholderText}
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
            placeholder="Password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        {errors.submit && <p className="error-text">{errors.submit}</p>}

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
}

export default LoginForm;
