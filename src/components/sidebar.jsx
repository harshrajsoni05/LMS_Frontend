import { NavLink, useNavigate } from "react-router-dom";
import CustomButton from "./button";
import "../styles/Sidebar.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authActions";
import book from "../assets/images/book.png";
import category from "../assets/images/category.png";
import listcheck from "../assets/images/listcheck.png";
import useradd from "../assets/images/useradd.png";
import dash from "../assets/images/dash.png";
import historyIcon from "../assets/images/history.png";  
import profileIcon from "../assets/images/category.png";  

const Sidebar = ({ username, role }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem('jwtToken');
    dispatch(logoutUser());
    navigate('/');
  }

  return (
    <div className="container">
      <div className="sidebar-menu">
        <ul className="menu-list">
          {/* Common items for admin role */}
          {role === "ROLE_ADMIN" && (
            <>
              <li className="menu-item">
                <img src={dash} alt="Dashboard" />
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={book} alt="Books" />
                <NavLink
                  to="/books"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Books
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={category} alt="Category" />
                <NavLink
                  to="/category"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Category
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={listcheck} alt="Issuance" />
                <NavLink
                  to="/issuance"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Issuance
                </NavLink>
              </li>
              <li className="menu-item">
                <img src={useradd} alt="Users" />
                <NavLink
                  to="/user"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Users
                </NavLink>
              </li>
            </>
          )}
          
          {/* Items for user role */}
          {role === "ROLE_USER" && (
            <>
              <li className="menu-item">
                <img src={historyIcon} alt="History" />
                <NavLink
                  to="/userhistory"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  History
                </NavLink>
              </li>
              
            </>
          )}
        </ul>
        <div className="btn-center">
          <CustomButton
            name={"Logout"}
            className={"logout-btn"}
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
