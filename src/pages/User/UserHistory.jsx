import { useState, useEffect } from "react";
import { fetchIssuancesbyUserId } from "../../api/IssuanceServices";
import Table from "../../components/table";
import WithLayoutComponent from "../../hocs/WithLayoutComponent";
import '../../styles/CategoryPage.css';
import back from  "../../assets/images/go-back.png"
import next from  "../../assets/images/go-next.png"
import { useSelector } from "react-redux";


function UserHistoryPage( ) {
  const [issuances, setIssuances] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const auth = useSelector((state) => state.auth);

  const userId =  auth.id; 

  const getIssuances = async () => {
    try {
      const data = await fetchIssuancesbyUserId(userId,currentPage, pageSize);
      setIssuances(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  useEffect(() => {
    getIssuances();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
        return "Pending Return"; 
    }
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const columns = [
    { header: "S No.", accessor: "serialNo" },
    { header: "Book", render: (rowData) => rowData?.books?.title || "N/A" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuance_type" },
    {
      header: "Issue Date",
      render: (rowData) => formatDate(rowData.issue_date),
    },
    {
      header: "Return Date",
      render: (rowData) => formatDate(rowData.return_date),
    },
  ];

  return (
    <div className="category-page">
      <div className="category-heading">
        <h1>Book Lending History</h1>
      </div>

      <div className="table-container">
        <Table data={issuances} columns={columns} currentPage={currentPage} pageSize={pageSize} />
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
  );
}

export const UserHistoryWithLayout = WithLayoutComponent(UserHistoryPage);
