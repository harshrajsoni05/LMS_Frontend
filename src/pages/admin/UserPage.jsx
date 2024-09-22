import { useState, useEffect } from "react";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  RegisterUser,
} from "../../api/UserServices";
import { fetchAllBooks } from "../../api/BookServices";
import { addIssuance } from "../../api/IssuanceServices";

import CustomModal from "../../components/Modal";
import Table from "../../components/Table";
import Searchbar from "../../components/Searchbar";
import Dynamicform from "../../components/DynamicForm";
import CustomButton from "../../components/Button";
import Tooltip from "../../components/ToolTip";
import WithLayoutComponent from "../../hocs/WithLayoutComponent";
import Toast from "../../components/Toast";
import IssuanceForm from "../../components/IssuanceForm";
import Loader from "../../components/Loader";

import back from "../../assets/images/go-back.png";
import next from "../../assets/images/go-next.png";
import EditIcon from "../../assets/images/editicon.png";
import DeleteIcon from "../../assets/images/deleteicon.png";
import assign from "../../assets/images/bookaddd.png";
import historyicon from "../../assets/images/historyicon.png";

import { useNavigate } from "react-router-dom";
import { modalSizes } from "../../components/Utils";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentData, setCurrentData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if(width>1024){
      return 7;
    }
    else if(width<=1024){
      return 10;
    }
  }
  const [pageSize] = useState(getPageSizeBasedOnWidth);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [status, setStatus] = useState("issued");
  const [issuanceType, setIssuanceType] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const showSuccessToast = (message) => {
    setToastType("success");
    setToastMessage(message);
    setShowToast(true);
  };
  const showFailureToast = (message) => {
    setToastType("failure");
    setToastMessage(message);
    setShowToast(true);
  };

  const navigate = useNavigate();
  
  const getUsers = async () => {
    setLoading(true);

    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm.length >= 3 || trimmedSearchTerm.length === 0) {
      try {

        const data = await fetchUsers(currentPage, pageSize, trimmedSearchTerm);
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    } else if (trimmedSearchTerm.length > 0 && trimmedSearchTerm.length < 3) {
      setLoading(false);
    } else {
      setLoading(false);
      setUsers([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    getUsers();
  }, [currentPage, searchTerm]);

  const getBooks = async () => {
    try {
      const data = await fetchAllBooks();
      setBooks(data || []);
    } catch (error) {
      showFailureToast("Can't fetch Books")
    }
  };

  useEffect(() => {
    getUsers();
    getBooks();
  }, [currentPage, searchTerm]);

  const handleEditUser = async (updatedUser) => {
    setLoading(true)
    try {
      const userToUpdate = {
        id: currentData.id,
        name: updatedUser.name,
        email: updatedUser.email.trim(),
        number: updatedUser.number.trim(),
        role: "ROLE_USER",
      };

      if (
        updatedUser.password &&
        updatedUser.password === updatedUser.confirmPassword
      ) {
        userToUpdate.password = updatedUser.password;
      }

      const response  = await updateUser(currentData.id, userToUpdate);
      getUsers();
      handleCloseModal();
      showSuccessToast(response.message);
    } catch (error) {
      console.error("Failed to update user:", error);
      showFailureToast(error.response.data.message);
      handleCloseModal()
    } finally{
      setLoading(false)

    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      handleCloseModal();
      showSuccessToast(response.message);
    } catch (error) {
      showFailureToast(error.response.data.message);
      handleCloseModal();
    } finally{
      setLoading(false)

    }
  };

  const handleIssueBook = async (issuanceDetails) => {
    try {
      const response = await addIssuance(issuanceDetails);
      handleCloseModal();
      showSuccessToast(response.message);
    } catch (error) {
      showFailureToast(error.response.data.message);
    } 
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = (type, rowData = {}) => {
    setModalType(type);
    setCurrentData(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentData({});
    setSelectedBook(null);
    setIssueDate("");
    setReturnDate("");
    setStatus("issued");
    setIssuanceType("");
  };

  const handleRegister = async (userdata) => {
    setLoading(true)
    try {
      const updatedUserData = { ...userdata, role: "ROLE_USER" };

      const response = await RegisterUser(updatedUserData);

      getUsers();

      handleCloseModal();

      showSuccessToast(response.message);
    } catch (error) {
      showFailureToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModal = (data) => {
    if (modalType === "edit") {
      handleEditUser(data);
    } else if (modalType === "register") {
      handleRegister(data);
      getUsers();
      handleCloseModal();
    }
  };

  const columns = [
    { header: "S No.", accessor: "serialNo" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone No.", accessor: "number" },
    {
      header: "Actions",
      render: (rowData) => (
        <div className="actionicons">
          <Tooltip message="Issue Book">
            <img
              src={assign}
              alt="Assign Book"
              style={{ paddingLeft: "0" }}
              className="action-icon"
              onClick={() => handleOpenModal("assign", rowData)}
            />
          </Tooltip>
          <Tooltip message="Edit">
            <img
              src={EditIcon}
              alt="Edit"
              className="action-icon"
              onClick={() => handleOpenModal("edit", rowData)}
            />
          </Tooltip>
          <Tooltip message="Records">
            <img
              src={historyicon}
              alt="history"
              className="action-icon"
              onClick={() =>
                navigate(`/history/user/${rowData.id}`, { state: { rowData } })
              }
            />
          </Tooltip>
          <Tooltip message="Delete">
            <img
              src={DeleteIcon}
              alt="Delete"
              className="action-icon"
              onClick={() => handleOpenModal("delete", rowData.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];


  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Users</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton
            name="Register User"
            onClick={() => handleOpenModal("register")}
            className="add"
          />
        </div>      
          {loading ? (<Loader/> ): (
          <div className="table-container">
            {users.length === 0 ? (
              <p>No Users found</p>
            ) : (
              <Table
                data={users}
                columns={columns}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </div>
        )}  

        <div className="pagination-controls">
          <img
            src={back}
            alt="Back"
            className={`icon ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => {
              if (currentPage > 0) handlePageChange(currentPage - 1);
            }}
          />
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <img
            src={next}
            alt="Next"
            className={`icon ${
              currentPage >= totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => {
              if (currentPage < totalPages - 1)
                handlePageChange(currentPage + 1);
            }}
          />
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        height={modalSizes.edit.height}
        width={modalSizes.edit.width}
      >
        {modalType === "assign" ? (
          <IssuanceForm
            onSubmit={handleIssueBook}
            selectedUser={currentData}
            onClose={handleCloseModal}
          />
        ) : modalType === "edit" ? (
          <Dynamicform
            heading="Edit User"
            fields={[
              {
                label: "Name",
                name: "name",
                type: "text",
                placeholder: "Name",
                defaultValue: currentData.name,
                required: true,

              },
              {
                label: "Email",
                name: "email",
                type: "text",
                placeholder: "Email",
                defaultValue: currentData.email,
                required: true,

              },
              {
                label: "Number",
                name: "number",
                type: "number",
                placeholder: "Enter Phone Number",
                defaultValue: currentData.number,
                required: true,

              },
              {
                label: "Enter password to change",
                name: "password",
                type: "password",
                placeholder: "Change password",
              },
              {
                name: "confirmPassword",
                type: "password",
                placeholder: "Confirm Changed Password",
              },
            ]}
            onSubmit={handleSubmitModal}
            defaultValues={currentData}
          />
        ) : modalType === "register" ? (
          <Dynamicform
            heading="Register User"
            fields={[
              {
                label: "Name",
                name: "name",
                type: "text",
                placeholder: "Enter Name",
                required: true,

              },
              {
                label: "Email",
                name: "email",
                type: "type",
                placeholder: "Enter Email",
                required: true,

              },
              {
                label: "Phone Number",
                name: "number",
                type: "number",
                placeholder: "Enter Phone Number",
                required: true,

              },
            ]}
            onSubmit={handleSubmitModal}
          />
        ) : modalType === "delete" ? (
          <div className="confirmation">
            <p>Are you sure you want to delete this User?</p>
            <div className="confirmation-buttons">
              <CustomButton
                onClick={() => handleDelete(currentData)}
                name="Yes"
              ></CustomButton>
              <CustomButton onClick={handleCloseModal} name="No"></CustomButton>
            </div>
          </div>
        ) : null}
        {}
      </CustomModal>

      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export const UserwithLayout = WithLayoutComponent(UsersPage);
