import { useState, useEffect } from "react";
import "../styles/CategoryPage.css";

import {
  fetchIssuances,
  updateIssuance,
  deleteIssuance,
} from "../api/IssuanceServices";

import CustomModal from "../components/modal";
import Table from "../components/table";
import SearchBar from "../components/searchbar";
import WithLayoutComponent from "../hocs/WithLayoutComponent";
import Dynamicform from "../components/dynamicform";
import Tooltip from "../components/toolTip";
import Toast from "../components/toast/toast";

import back from "../assets/images/go-back.png";
import next from "../assets/images/go-next.png";
import EditIcon from "../assets/images/editicon.png";
import DeleteIcon from "../assets/images/deleteicon.png";
import CustomButton from "../components/button";

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

function IssuancesPage() {
  const [issuances, setIssuances] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [currentData, setCurrentData] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
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

  const getIssuances = async () => {
    try {
      const data = await fetchIssuances(currentPage, pageSize, debouncedSearchTerm.trim());
      setIssuances(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching issuances:", error);
    }
  };

  useEffect(() => {
    getIssuances();
  }, [currentPage, debouncedSearchTerm]);

  const handleEditIssuance = async (updatedIssuance) => {
    try {
      const issuanceToUpdate = {
        id: currentData.id,
        user_id: currentData.user_id,
        book_id: currentData.book_id,
        issue_date: currentData.issue_date,
        return_date: updatedIssuance.return_date, 
        status: updatedIssuance.status, 
        issuance_type: currentData.issuance_type,
      };

      await updateIssuance(currentData.id, issuanceToUpdate);
      getIssuances();
      handleCloseModal();
      showSuccessToast("Issuance Edited successfully!");

    } catch (error) {
      console.error("Failed to update issuance:", error);
      showFailureToast("Failed to update Issuance");

    }
  };

  const handleDelete = async (id) => {
      try {
        await deleteIssuance(id);
        setIssuances(issuances.filter((issuance) => issuance.id !== id));
        handleCloseModal();
        showSuccessToast("Issuance Deleted successfully!");

      } catch (error) {
        console.error("Failed to delete the issuance:", error);
        showFailureToast("Failed to Delete Issuance");

      }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    getIssuances();
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
  };

  const handleSubmitModal = (data) => {
    if (modalType === "edit") {
      handleEditIssuance(data);
    }
    
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Pending Return";
    }
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const columns = [
    { header: "S No.", accessor: "serialNo" },
    { header: "User", render: (rowData) => rowData?.users?.name || "N/A" },
    { header: "Book", render: (rowData) => rowData?.books?.title || "N/A" },
    { header: "Status", accessor: "status" },
    {
      header: "Issuance Type", 
      render: (rowData) => rowData.issuance_type === "In House" ? "Takeaway" : "In House",
    },
    {
      header: "Issue Date",
      render: (rowData) => {
        if (rowData.issuance_type === "Library") {
          const issueTime = new Date(rowData.issue_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return issueTime;
        }
        const issueDate = new Date(rowData.issue_date).toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric',
        });
        return issueDate;
      },
    },
    {
      header: "Return Date",
      render: (rowData) => {
        if (!rowData.return_date) {
          return "Pending";
        }
        if (rowData.issuance_type === "In House") {
          const returnDate = new Date(rowData.return_date).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
          });
          return returnDate;
        } else if (rowData.issuance_type === "Library") {
          const returnTime = new Date(rowData.return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return returnTime;
        }
        return "N/A";
      },
    },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
    },
  ];
  
  
  

  const renderActions = (rowData) => (
    <div className="actionicons">
      <Tooltip message="Edit">
        <img src={EditIcon} alt="Edit" style={{ paddingLeft: "0" }} className="action-icon"
          onClick={() => handleOpenModal("edit", rowData)}
        />
      </Tooltip>

      <Tooltip message="Delete">
        <img src={DeleteIcon} alt="Delete" className="action-icon"
          onClick={() => handleOpenModal("delete",rowData.id)}
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      <div className="category-page">
        <div className="category-heading">
          <h1>Issuances</h1>
          <SearchBar searchTerm={searchTerm} onChange={handleSearchChange} onSearch={handleSearch}/>
        </div>

        <div className="table-container">
          <Table data={issuances} columns={columns} currentPage={currentPage} pageSize={pageSize}
          />
        </div>

        <div className="pagination-controls">
          <img src={back} alt="back" className={`icon ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => {
              if (currentPage > 0) handlePageChange(currentPage - 1);
            }}
          />
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <img src={next} alt="next" className={`icon ${ currentPage >= totalPages - 1 ? "disabled" : ""}`}
            onClick={() => {
              if (currentPage < totalPages - 1)
                handlePageChange(currentPage + 1);
              }}
          />
        </div>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
      {modalType === "edit" ? (<Dynamicform
          heading="Edit Issuance"
          fields={[
            {  label:"Status",
              name: "status",
              type: "select",
              placeholder: "Status",
              required: true,
              options: [
                { value: "Returned", label: "Returned" },
                { value: "Pending", label: "Pending" },
              ],
              defaultValue: currentData.status,
            },
            {
              name: "return_date",
              label:"Return date",
              type: "datetime-local",
              placeholder: "Return Date",
              required: false,
              defaultValue: currentData.return_date,
            },
            
            
          ]}
          onSubmit={handleSubmitModal}
          onCancel={handleCloseModal}
          defaultValues={currentData}

        />): modalType === "delete" ? (
          <div className="confirmation">
            <p>Are you sure you want to delete this Issuance?</p>
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


export const IssuancewithLayout = WithLayoutComponent(IssuancesPage);
