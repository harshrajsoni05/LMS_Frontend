import { useState } from "react";
import { findBookSuggestions } from "../api/BookServices";
import { SearchByNumber as findUserByMobile } from "../api/UserServices";
import "../styles/Issuanceform.css";
import CustomButton from "./button";
import { formatDateTime } from "./utils";
import { useNavigate } from "react-router-dom";

const IssuanceForm = ({ onSubmit, selectedUser, selectedBook, onClose }) => {
  const navigate = useNavigate();

  const [bookTitle, setBookTitle] = useState(selectedBook?.title || "");
  const [book_id, setBookId] = useState(selectedBook?.id || null);

  const [userMobileNumber, setUserMobileNumber] = useState(selectedUser?.mobile || "");
  const [user_id, setUserId] = useState(selectedUser?.id || null);
  const [userName, setUserName] = useState(""); // New state for user name
  
  const [issuance_type, setIssuanceType] = useState("In House");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [issue_date] = useState(() => {
    const date = new Date();
    const istOffset = 5 * 60 + 30;
    const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
    return istTime.toISOString().split('.')[0];
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchBookSuggestions = async (query) => {
    if (query.length < 2) {
      setBookSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const suggestions = await findBookSuggestions(query);
      setBookSuggestions(suggestions);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to fetch book suggestions:", error);
      setBookSuggestions([]);
    }
  };

  const handleBookTitleChange = (e) => {
    const title = e.target.value;
    setBookTitle(title);
    setBookId(null);
    fetchBookSuggestions(title);
  };

  const handleSuggestionClick = (book) => {
    setBookTitle(book.title);
    setBookId(book.id);
    setErrorMessage("");
    setShowDropdown(false);
  };

  const fetchUserDetails = async (mobileNumber) => {
    try {
      const userDetails = await findUserByMobile(mobileNumber);
      if (userDetails.content && userDetails.content.length > 0) {
        const user = userDetails.content[0];
        setUserId(user.id);
        setUserName(user.name); 
        setErrorMessage("");
      } else {
        setUserId(null);
        setUserName(""); 
        setErrorMessage("User not found. Please register first.");
      }
    } catch (error) {
      setUserId(null);
      setUserName(""); 
      setErrorMessage("User not found. Please register first.");
    }
  };

  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    setUserMobileNumber(mobileNumber);
    if (mobileNumber.length >= 10) {
      fetchUserDetails(mobileNumber);
    } else {
      setUserId(null);
      setUserName(""); 
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!book_id || !user_id) {
      setErrorMessage("Please enter valid details.");
      return;
    }

    let returnedAt = null;
    if (issuance_type === "In House" && expectedReturn) {
      returnedAt = formatDateTime(new Date(expectedReturn).toLocaleString());
    } else if (issuance_type === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10);
      returnedAt = formatDateTime(new Date(`${currentDate}T${returnTime}`).toLocaleString());
    }

    const issuanceDetails = {
      user_id,
      book_id,
      issue_date,
      return_date: returnedAt,
      status: "Issued",
      issuance_type,
    };

    try {
      await onSubmit(issuanceDetails);
      onClose();

      setTimeout(() => {
        navigate("/issuance");
      }, 1000);

    } catch (error) {
      console.error("Failed to create issuance:", error);
    }
  };

  const now = new Date().toISOString().slice(0, 16);
  
  return (
    <div className="issuance-form">
      <h2>Issue Book</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {userName && (
                <p className="success-message">Found user with name -  {userName}</p>
              )}
        {selectedBook ? (
          <>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                value={userMobileNumber}
                onChange={handleMobileNumberChange}
                placeholder="Enter User Mobile Number"
              />
              
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                value={bookTitle}
                onChange={handleBookTitleChange}
                placeholder="Enter Book Title"
              />
              {showDropdown && bookSuggestions.length > 0 && (
                <ul className="dropdown-suggestions">
                  {bookSuggestions.map((book) => (
                    <li key={book.id} onClick={() => {
                      if (book.quantity > 0) {
                        handleSuggestionClick(book);
                      }
                    }} className={book.quantity === 0 ? 'disabled' : ''}>
                      {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
        <div className="form-group">
          <label>Issuance Type</label>
          <select
            value={issuance_type}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="In House">Takeaway</option>
            <option value="Library">In House</option>
          </select>
        </div>
        {issuance_type === "In House" ? (
          <div className="form-group">
            <label>Expected Return Date & Time</label>
            <input
              type="datetime-local"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              min={now}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Expected Return Time</label>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              min={now}
            />
          </div>
        )}
        <CustomButton className="submit-button" name="Issue Book" />
      </form>
    </div>
  );
};

export default IssuanceForm;
