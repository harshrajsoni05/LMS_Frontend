import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
  assignBookToUser,
} from "../api/BookServices";
import { fetchAllCategories } from "../api/CategoryServices";
import { addIssuance } from "../api/IssuanceServices";

//components
import CustomButton from "../components/button";
import CustomModal from "../components/modal";
import Table from "../components/table";
import Searchbar from "../components/searchbar";
import Dynamicform from "../components/dynamicform";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Tooltip from "../components/toolTip";
import Toast from "../components/toast/toast";

//images
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import historyicon from "../assets/images/historyicon.png";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import AssignUser from "../assets/images/alloticon.png";
import IssuanceForm from "../components/issuanceform";
import { modalSizes } from "../components/utils";
import HOC from "../hocs/WithLayoutComponent";



function BooksPage(){
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentData, setCurrentData] = useState({
    title: "",
    author: "",
    quantity: "",
    category_id: "",
    userId: "",
    imageURL: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [issuanceType, setIssuanceType] = useState("library");
  const [isIssuanceModalOpen, setIsIssuanceModalOpen] = useState(false);
  const [userNotRegistered, setUserNotRegistered] = useState(false);

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
  
  const getBooks = async () => {
    const trimmedSearchTerm = searchTerm.trim(); 
  
    if (trimmedSearchTerm.length >= 3 || trimmedSearchTerm.length === 0) {
      try {
        const data = await fetchBooks(currentPage, pageSize, trimmedSearchTerm);
        setBooks(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    } else if (trimmedSearchTerm.length > 0 && trimmedSearchTerm.length < 3) {
    } else {
      setBooks([]);
      setTotalPages(0);
    }
  };
  

  useEffect(() => {
    getBooks();
  }, [currentPage, searchTerm]);

  const getCategories = async () => {
    try {
      const data = await fetchAllCategories();
      setCategories(data || []);
    } catch (error) {
      showFailureToast("Can't fetch Books!")
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAddBook = async (newBook) => {
    try {
      const bookToCreate = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        category_id: parseInt(newBook.category_id, 10),
        quantity: parseInt(newBook.quantity, 10),
        imageURL: newBook.imageURL ? newBook.imageURL.trim() : "",
      };
      await addBook(bookToCreate);
      getBooks();
      showSuccessToast("Book added successfully!");
      handleCloseModal();
    } catch (error) {
      showFailureToast("Failed to add book!");
      handleCloseModal();

    }
  };
  
  const handleEditBook = async (updatedBook) => {
    try {
      const bookToUpdate = {
        id: currentData.id,
        title: updatedBook.title.trim(),
        author: updatedBook.author.trim(),
        category_id: parseInt(updatedBook.category_id, 10),
        quantity: parseInt(updatedBook.quantity, 10),
        imageURL: updatedBook.imageURL ? updatedBook.imageURL.trim() : "",
      };
      await updateBook(currentData.id, bookToUpdate);
      getBooks();
      handleCloseModal();
      showSuccessToast("Book edited successfully!");
    } catch (error) {
      console.error("Failed to update book:", error);
      showFailureToast("Failed to update book!");

    }
  };
  
  const handleDelete = async (rowData) => {
    const id = rowData.id;
    try {
      await deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
      showSuccessToast("Book deleted successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete the book", error);
      showFailureToast("Cannot delete. Book has been issued!");
      handleCloseModal();

    }
  };
  

  const handleIssuanceSubmit = async (issuanceDetails) => {
    try {
      console.log(issuanceDetails);
      const response = await addIssuance(issuanceDetails);

      getBooks();
      showSuccessToast("Issued book Successfully!");
    } catch (error) {
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
      imageURL: "",
    });
    setPhoneNumber("");
    setIssuanceType("library");
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

   const [columns] = useState([
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "Category", render: (rowData) => rowData.category.name },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ]);

  const renderActions = (rowData) => (
    <div className="actionicons">
      <Tooltip message="Issue">
        <img
          src={AssignUser}
          alt="Assign User"
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
            navigate(`/history/book/${rowData.id}`, { state: { rowData } })
          }
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
          {books.length === 0 ? (
            <p>No data found</p>
          ) : (
            <Table data={books} columns={columns} />
          )}
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
        {modalType === "edit" || modalType === "add" ? (
          <Dynamicform
            heading={modalType === "edit" ? "Edit Book" : "Add Book"}
            fields={[
              {
                label: "Select Category",
                name: "category_id",
                type: "select",
                placeholder: "Select Category",
                required: true,
                options: categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
                defaultValue: currentData.category_id,
              },
              {
                label: "Title",
                name: "title",
                type: "text",
                placeholder: "Book Title",
                required: true,
                defaultValue: currentData.title,
              },
              {
                label: "Author",
                name: "author",
                type: "text",
                placeholder: "Author Name",
                required: true,
                defaultValue: currentData.author,
              },
              {
                label: "Quantity",
                name: "quantity",
                type: "number",
                placeholder: "Quantity",
                required: true,
                defaultValue: currentData.quantity,
              },
              {
                label: "Image",
                name: "imageURL",
                type: "text",
                placeholder: "Image URL",
                defaultValue: currentData.imageURL,
              },
            ]}
            defaultValues={currentData}
            onCancel={handleCloseModal}
            onSubmit={handleSubmitModal}
            submitLabel={modalType === "edit" ? "Save" : "Add"}
          />
        ) : modalType === "assign" ? (
          <IssuanceForm
            onSubmit={handleIssuanceSubmit}
            selectedBook={selectedBook}
            onClose={handleCloseModal}
          />
        ) : modalType === "delete" ? (
          <div className="confirmation">
            <p>Are you sure you want to delete this Book?</p>
            <div className="confirmation-buttons">
              <CustomButton
                onClick={() => handleDelete(currentData)}
                name="Yes"
              ></CustomButton>
              <CustomButton onClick={handleCloseModal} name="No"></CustomButton>
            </div>
          </div>
        ) : null}
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


export default HOC(BooksPage);
