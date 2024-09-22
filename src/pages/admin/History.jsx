import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/CategoryPage.css';

import { fetchIssuancesbyBookId, fetchIssuancesbyUserId } from '../../api/IssuanceServices';
import Table from '../../components/Table';
import WithLayoutComponent from '../../hocs/WithLayoutComponent';

import back from '../../assets/images/go-back.png';
import next from '../../assets/images/go-next.png';
import backbutton from '../../assets/images/back (1).png';

const History = () => {
  const { bookId, userId } = useParams(); 

  const navigate = useNavigate(); 

  const [issuances, setIssuances] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const getIssuances = async () => {
    try {
      let data;
      if (bookId) {
        data = await fetchIssuancesbyBookId(bookId, currentPage, pageSize);
      } else if (userId) {
        data = await fetchIssuancesbyUserId(userId, currentPage, pageSize);
      }
      setIssuances(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    getIssuances();
  }, [currentPage, bookId, userId]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
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
  ];

  return (
    <div className="category-page">
      
      <div className="category-heading">
     
        {userId > 0 ? (<h1>User Lending History</h1>) : (<h1>Book Lending History</h1>)}
        <img
        src={backbutton}
        alt="back"
        className="back-button"
        onClick={() => navigate(-1)}
      />
    </div>
    
      <div className="table-container">
        {issuances.length > 0 ? (
          <Table data={issuances} columns={columns} currentPage={currentPage} pageSize={pageSize} />
        ) : (
          <p>No records found</p>
        )}
      </div>

      {issuances.length > 0 && (
        <div className="pagination-controls">
          <img
            src={back}
            alt="back"
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
            alt="next"
            className={`icon ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
            onClick={() => {
              if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export const HistoryWithLayout = WithLayoutComponent(History);
