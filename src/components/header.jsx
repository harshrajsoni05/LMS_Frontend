import { useState  } from 'react';
import { useNavigate} from "react-router-dom";


import admin from '../assets/images/admin.png';
import user from '../assets/images/user.png';
import '../styles/Header.css';

const Header = ({ role, userName}) => {
  const navigate = useNavigate(); 
  
  const onLogout = async () => {
    try {
      localStorage.removeItem("jwtToken");
      navigate("/"); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const avatarSrc = role === 'ROLE_ADMIN' ? admin : user;

  const handleAvatarClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    
  };
 
  return (
    
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>ShelfHive</h1>
      </div>
      
      <div className="navbar-user">
        <div className="user-name">
          <span>{userName}</span>
        </div>
        <div className="user-avatar" onClick={handleAvatarClick}>
          <img src={avatarSrc} alt="User Avatar" />
        </div>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
