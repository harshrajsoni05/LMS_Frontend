import '../styles/LoginPage.css';
import backgroundImage from '../assets/images/2.jpg'; // Adjust the path as necessary
import LoginForm from '../components/loginform';

const LoginPage = () => {
  return (
    <div className="container-loginpage">
      <div className="login-page">
        <div className="login-left">
          <img src={backgroundImage} alt="Nature Background" className="login-image" />
        </div>
        <div className="login-right">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
