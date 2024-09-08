import { useState, useEffect } from 'react';

import { fetchUsers, 
          updateUser, 
          deleteUser , 
          RegisterUser} from '../api/UserServices'; 
import { fetchAllBooks} from '../api/BookServices';
import { addIssuance } from '../api/IssuanceServices'; 

import CustomModal from '../components/modal';
import Table from '../components/table';
import Searchbar from '../components/searchbar';
import Dynamicform from '../components/dynamicform';
import CustomButton from '../components/button';
import Tooltip from '../components/toolTip';
import WithLayoutComponent from '../hocs/WithLayoutComponent';
import Toast from '../components/toast/toast';

import back from '../assets/images/go-back.png';
import next from '../assets/images/go-next.png';
import EditIcon from '../assets/images/editicon.png';
import DeleteIcon from '../assets/images/deleteicon.png';
import assign from '../assets/images/bookaddd.png';
import historyicon from '../assets/images/historyicon.png'
import { useNavigate } from 'react-router-dom';
import UserIssuanceform from '../components/userIssuanceform';

const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentData, setCurrentData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('issued');
  const [issuanceType, setIssuanceType] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

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

  const navigate = useNavigate();
  // Fetch Data
  const getUsers = async () => {
    try {
      const data = await fetchUsers(currentPage, pageSize, debouncedSearchTerm.trim());
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getBooks = async () => {
    try {
      const data = await fetchAllBooks();
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    getUsers();
    getBooks();
  }, [currentPage, debouncedSearchTerm]);

  // Handlers
  const handleEditUser = async (updatedUser) => {
    try {
      const userToUpdate = {
        id: currentData.id,
        name: updatedUser.name,
        email: updatedUser.email,
        number: updatedUser.number,
        role: "ROLE_USER",
      };
  
      if (updatedUser.password && updatedUser.password === updatedUser.confirmPassword) {
        userToUpdate.password = updatedUser.password;
      }
  
      await updateUser(currentData.id, userToUpdate);
      getUsers();
      handleCloseModal();
      showSuccessToast("User edit Success!");

    } catch (error) {
      console.error('Failed to update user:', error);
      showFailureToast("Failed to update User")
    }
  };
  

  const handleDelete = async (id) => {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        handleCloseModal()
        showSuccessToast("User Deleted successfully!");

      } catch (error) {
        showFailureToast("Failed to delete the user due its issuances!")

      }
    
  };

  const handleIssueBook = async (issuanceDetails) => {
    try {
      await addIssuance(issuanceDetails);
      handleCloseModal(); 
      showSuccessToast("Book Issued successfully!");
    } catch (error) {
      console.error('Failed to create issuance:', error);
      showFailureToast("Failed to Issue Book!");
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
    setIssueDate('');
    setReturnDate('');
    setStatus('issued');
    setIssuanceType('');
  };



  const handleRegister = async (userdata) => {
  try {
    const updatedUserData = { ...userdata,role:"ROLE_USER"};
    
    console.log("User registered-> " + JSON.stringify(updatedUserData)) 
    await RegisterUser(updatedUserData);

    getUsers();

    handleCloseModal();
    showSuccessToast("User Registered successfully!")
  } catch (error) {
    console.log(error);
    showFailureToast("User Failed to Register!")
  }
};

  const handleSubmitModal = (data) => {
    if (modalType === 'edit') {
      handleEditUser(data);
    } else if (modalType === 'register') {
       
      handleRegister(data);
      getUsers();
      handleCloseModal();
    }
    
  };

  const columns = [
    { header: 'S No.', accessor: 'serialNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone No.', accessor: 'number' },
    {
      header: 'Actions',
      render: (rowData) => (
        <div className="actionicons">
          <Tooltip message="Issue Book">
            <img
              src={assign}
              alt="Assign Book"
              style={{ paddingLeft: '0' }}
              className="action-icon"
              onClick={() => handleOpenModal('assign', rowData)}
            />
          </Tooltip>
          <Tooltip message="Edit">
            <img
              src={EditIcon}
              alt="Edit"
              className="action-icon"
              onClick={() => handleOpenModal('edit', rowData)}
            />
          </Tooltip>
          <Tooltip message="Records">

          <img
            src={historyicon}
            alt="history"
            className="action-icon"
            onClick={() => navigate(`/history/user/${rowData.id}`, { state: { rowData } })}
          />
          </Tooltip>
          <Tooltip message="Delete">
            <img
              src={DeleteIcon}
              alt="Delete"
              className="action-icon"
              onClick={() => handleOpenModal('delete',rowData.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
const handleBookSelection = (e) => {
  const selectedBookId = e.target.value;

  if (books?.length) {
    const selectedBook = books.find(book => book.id === parseInt(selectedBookId, 10));
    setSelectedBook(selectedBook);
  } else {
    console.error("Books array is not available.");
  }
};



  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Users</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton name="Register User" onClick={() => handleOpenModal('register')} className="add" />
        </div>

        <div className="table-container">
          <Table data={users} columns={columns} currentPage={currentPage} pageSize={pageSize}/>
        </div>

        <div className="pagination-controls">
          <img
            src={back}
            alt="Back"
            className={`icon ${currentPage === 0 ? 'disabled' : ''}`}
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
            className={`icon ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
            onClick={() => {
              if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
            }}
          />
        </div>
      </div>
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
  {modalType === 'assign' ? (
    <UserIssuanceform
      onSubmit={handleIssueBook} 
      selectedUser={currentData} 
      onClose={handleCloseModal} 
    />
  ) : modalType === 'edit' ? (
    <Dynamicform
      heading="Edit User"
      fields={[
        { name: 'name', type: 'text', placeholder: 'Name', defaultValue: currentData.name },
        { name: 'email', type: 'email', placeholder: 'Email', defaultValue: currentData.email },
        { name: 'number', type: 'text', placeholder: 'Number', defaultValue: currentData.number },
        { name: 'password', type: 'password', placeholder: 'Change password' },
        { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Changed Password' },
      ]}
      onSubmit={handleSubmitModal}
      defaultValues={currentData}
    />
  ) : modalType === 'register' ? (
    <Dynamicform
      heading="Register User"
      fields={[
        { name: 'name', type: 'text', placeholder: 'Enter Name' },
        { name: 'email', type: 'email', placeholder: 'Enter Email' },
        { name: 'number', type: 'text', placeholder: 'Enter Phone Number' },
      ]}
      onSubmit={handleSubmitModal}
    />
  ) : modalType === "delete" ? (
    <div className="confirmation">
      <p>Are you sure you want to delete this User?</p>
      <div className="confirmation-buttons">
      <CustomButton onClick={() => handleDelete(currentData)} name="Yes"></CustomButton>
      <CustomButton onClick={handleCloseModal} name="No"></CustomButton></div>
    </div>
  ) : null }{}
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
