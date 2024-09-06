import { useState, useEffect } from "react";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
  assignBookToUser,
} from "../api/BookServices";
import { fetchAllCategories } from '../api/CategoryServices';
import { addIssuance } from "../api/IssuanceServices";
import useDebouncedValue from "./CategoryPage";

//components
import CustomButton from "../components/button";
import CustomModal from "../components/modal";
import Table from "../components/table";
import Searchbar from "../components/searchbar";
import Dynamicform from "../components/dynamicform";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Tooltip from "../components/toolTip";

//images
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import historyicon from "../assets/images/historyicon.png";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import AssignUser from "../assets/images/alloticon.png";
import IssuanceForm from "../components/issuanceform";


//
import Toast from "../components/toast/toast";
import { useNavigate } from "react-router-dom";

function BooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit', 'add', or 'assign'
  const [currentData, setCurrentData] = useState({
    title: "",
    author: "",
    quantity: "",
    category_id: "",
    userId: "",
    imageURL:""
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const [selectedBook, setSelectedBook] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [issuanceType, setIssuanceType] = useState('library');
  const [isIssuanceModalOpen,setIsIssuanceModalOpen]=useState(false)
  const [userNotRegistered, setUserNotRegistered] = useState(false);

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

  const getBooks = async () => {
    try {
      const data = await fetchBooks(currentPage, pageSize, debouncedSearchTerm.trim());
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    getBooks();
  }, [currentPage, debouncedSearchTerm]);

  const getCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAddBook = async (newBook) => {
    try {
      const bookToCreate = {
        title: newBook.title,
        author: newBook.author,
        category_id: parseInt(newBook.category_id, 10),
        quantity: parseInt(newBook.quantity, 10),
        imageURL: newBook.imageURL || "",
      };
      await addBook(bookToCreate);
      getBooks();
      showSuccessToast("Book added successfully!");

      handleCloseModal();
    } catch (error) {
      console.error("Failed to add book:", error.message);
    }
  };

  const handleEditBook = async (updatedBook) => {
    try {
      const bookToUpdate = {
        id: currentData.id,
        title: updatedBook.title,
        author: updatedBook.author,
        category_id: parseInt(updatedBook.category_id, 10),
        quantity: parseInt(updatedBook.quantity, 10),
      };
      await updateBook(currentData.id, bookToUpdate);
      getBooks();
      handleCloseModal();
      showSuccessToast("Book edited Successfully!");

    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDelete = async (rowData) => {
    const id = rowData.id;
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
        showSuccessToast("Book deleted Successfully!");
        handleCloseModal();

      } catch (error) {
        console.error("Failed to delete the book", error);
      }
    
  };

  const handleIssuanceSubmit = async (issuanceDetails) => {
    try {
        console.log(issuanceDetails);
       const response = await addIssuance(issuanceDetails);
       console.log(response);
      if (response === "Issuance already exists for this user and book.") {
          alert(response);
      }
      else if (response==="No copies available for the selected book."){
             alert(response);
      }
      
      getBooks();
      showSuccessToast("Issued book Successfully!");

  } catch (error) {
      console.error("Failed to create issuance:", error);
      showFailureToast("Failed Issuance!");
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
    setSelectedBook(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentData({
      title: "",
      author: "",
      quantity: "",
      category_id: "",
      userId: "",
      imageURL:""
    });
    setPhoneNumber('');
    setIssuanceType('library');
    setUserNotRegistered(false);
  };

  const handleSubmitModal = (data) => {
    if (modalType === "add") {
      handleAddBook(data);
    } else if (modalType === "edit") {
      handleEditBook(data);
    } else if (modalType === "assign") {
      handleIssuanceSubmit(data);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Category", render: (rowData) => rowData.category.name },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ];

  const renderActions = (rowData) => (
    <div className="actionicons">
      <Tooltip message="Issue">
        <img
          src={AssignUser}
          alt="Assign User"
          style={{ paddingLeft: '0' }}
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
          onClick={() => navigate(`/history/book/${rowData.id}`, { state: { rowData } })}
        />
      </Tooltip>

      <Tooltip message="Delete">
    <img
      src={DeleteIcon}
      alt="Delete"
      className="action-icon"
      onClick={() => handleOpenModal("delete", rowData)} // pass rowData for deletion
    />
    </Tooltip>


      
    </div>
  );

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Books List</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton
            name="Add Book"
            onClick={() => handleOpenModal("add")}
            className="add"
          />
        </div>

        <div className="table-container">
          <Table data={books} columns={columns} />
        </div>

        <div className="pagination-controls">
          <img
            src={back}
            alt="back"
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
            alt="next"
            className={`icon ${currentPage >= totalPages - 1 ? "disabled" : ""}`}
            onClick={() => {
              if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
            }}
          />
        </div>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
  {modalType === 'edit' || modalType === 'add' ? (
    <Dynamicform
      heading={modalType === 'edit' ? 'Edit Book' : 'Add Book'}
      fields={[
        {
          name: 'category_id',
          type: 'select',
          placeholder: 'Select Category',
          required: true,
          options: categories.map(category => ({
            value: category.id,
            label: category.name,
          })),
          defaultValue: currentData.category_id,
        },
        {
          name: 'title',
          type: 'text',
          placeholder: 'Book Title',
          required: true,
          defaultValue: currentData.title,
        },
        {
          name: 'author',
          type: 'text',
          placeholder: 'Author Name',
          required: true,
          defaultValue: currentData.author,
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
          required: true,
          defaultValue: currentData.quantity,
        },
        {
          name: 'imageURL',
          type: 'text',
          placeholder: 'Image URL',
          defaultValue: currentData.imageURL,
        },
      ]}
      onCancel={handleCloseModal}
      onSubmit={handleSubmitModal}
      submitLabel={modalType === 'edit' ? 'Save' : 'Add'}
    />
  ) : modalType === 'assign' ? (
    <IssuanceForm
      onSubmit={handleIssuanceSubmit}
      selectedBook={selectedBook}
      onClose={handleCloseModal}
    />
  ) : modalType === 'delete' ? (

    <div className="confirmation">
      <p>Are you sure you want to delete this Book?</p>
      <div className="confirmation-buttons">
      <CustomButton onClick={() => handleDelete(currentData)} name="Yes"></CustomButton>
      <CustomButton onClick={handleCloseModal} name="No"></CustomButton></div>
      </div>
  ) 
  
  : null}

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

export const BookswithLayout = WithLayoutComponent(BooksPage);
