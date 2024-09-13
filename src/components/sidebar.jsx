import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CustomButton from "./button";
import Modal from "../components/modal";
import "../styles/Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authActions";
import book from "../assets/images/book.png";
import category from "../assets/images/category.png";
import listcheck from "../assets/images/listcheck.png";
import useradd from "../assets/images/useradd.png";
import dash from "../assets/images/dash.png";
import historyIcon from "../assets/images/history.png";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    window.localStorage.removeItem("jwtToken");
    dispatch(logoutUser());
    navigate("/");
  };

  const openLogoutModal = () => {
    setIsModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeLogoutModal();
  };

  return (
    <div className="container">
      <div className="sidebar-menu">
        <ul className="menu-list">
          {role === "ROLE_ADMIN" && (
            <>
              <li className="menu-item">
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={dash} alt="Dashboard" />
                  Dashboard
                </NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/category" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={category} alt="Category" />
                  Category
                </NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/books" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={book} alt="Books" />
                  Books
                </NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/user" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={useradd} alt="Users" />
                  Users
                </NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/issuance" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={listcheck} alt="Issuance" />
                  Issuance
                </NavLink>
              </li>
            </>
          )}
          {role === "ROLE_USER" && (
            <>
              <li className="menu-item">
                <NavLink to="/userhistory" className={({ isActive }) => (isActive ? "active" : "")}>
                  <img src={historyIcon} alt="History" />
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
            onClick={openLogoutModal} 
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeLogoutModal} height="200px" width="300px">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="modal-actions">
          <CustomButton onClick={confirmLogout} name={"Yes"} className={"confirm"}></CustomButton>
          <CustomButton onClick={closeLogoutModal} name={"No"}>No</CustomButton>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
