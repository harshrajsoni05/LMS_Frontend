import { useState, useEffect } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../api/CategoryServices"; // Adjust the import path as needed
import CustomButton from "../components/button";
import CustomModal from "../components/modal";
import Table from "../components/table";
import Searchbar from "../components/searchbar";
import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import HOC from "../hocs/WithLayoutComponent";
import Dynamicform from "../components/dynamicform";
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import Tooltip from "../components/toolTip";
import Toast from "../components/toast/toast";


const CategoryPage = ()=> {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'edit' or 'add'
  const [currentData, setCurrentData] = useState({
    name: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getCategories = async () => {
    try {
      const data = await fetchCategories(currentPage, pageSize, searchTerm.trim());
      setCategories(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      showFailureToast("Can't Fetch Categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, [currentPage, searchTerm]);

  const handleAddCategory = async (newCategory) => {
    try {
      const categoryToCreate = {
        name: newCategory.name,
        description: newCategory.description,
      };
  
      await addCategory(categoryToCreate);

      getCategories();
      handleCloseModal();
      showSuccessToast("Category added successfully!");

    } catch (error) {

      showFailureToast("Failed to add category")
      
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const categoryToUpdate = {
        id: currentData.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
      };

      await updateCategory(currentData.id, categoryToUpdate);
      getCategories();
      handleCloseModal();
      showSuccessToast("Category Edited!");

    } catch (error) {
      showSuccessToast("Category Edit Failed!");

    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      showSuccessToast("Category Deleted Succesfully!");

    } catch (error) {
      showFailureToast("Cannot Delete Category as it has Issued Books!")
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
    setCurrentData({
      name: "",
      description: "",
    });
  };

  const handleSubmitModal = (data) => {
    if (modalType === "add") {
      handleAddCategory(data);
    } else if (modalType === "edit") {
      handleEditCategory(data);
    } 
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ];

  const renderActions = (rowData) => (
    <div className="actionicons">
      <Tooltip message="Edit">
        <img
          src={EditIcon}
          alt="Edit"
          className="action-icon"
          onClick={() => handleOpenModal("edit", rowData)}
        />
      </Tooltip>

      <Tooltip message="Delete">
        <img
          src={DeleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={() => handleOpenModal("delete",rowData.id)}
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Category List</h1>
          <Searchbar searchTerm={searchTerm} onChange={handleSearchChange} />
          <CustomButton
            name="Add Category"
            onClick={() => handleOpenModal("add")}
            className="add"
          />
        </div>

        <div className="table-container">
          <Table data={categories} columns={columns} currentPage={currentPage} pageSize={pageSize}  />
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

      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} >
  {modalType === "edit" || modalType === "add" ? (
    <Dynamicform
      heading={modalType === "edit" ? "Edit Category" : "Add Category"}
      fields={[
        { label:"Name",
          name: "name",
          type: "text",
          placeholder: "Category Name",
          required: true,
          defaultValue: currentData.name,
        },
        { label:"Description",
          name: "description",
          type: "text-area",
          placeholder: "Description",
          required: false,
          defaultValue: currentData.description,
        },
      ]}
      onSubmit={handleSubmitModal}
      defaultValues={currentData} 
    />
  ) : modalType === "delete" ? (
    <div className="confirmation">
      <p>Are you sure you want to delete this Category?</p>
      <div className="confirmation-buttons">
      <CustomButton onClick={() => handleDelete(currentData)} name="Yes"></CustomButton>
      <CustomButton onClick={handleCloseModal} name="No"></CustomButton></div>
    </div>
  ) : null} {}
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


export default HOC(CategoryPage);
