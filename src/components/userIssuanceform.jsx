import { useState } from "react";
import { findBookSuggestions } from "../api/BookServices";
import "../styles/Issuanceform.css";
import CustomButton from "./button";
import { formatDateTime } from "./utils"; 

const UserIssuanceform = ({ onSubmit, selectedUser, onClose }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [book_id, setBookId] = useState(null);
  const [issuance_type, setIssuanceType] = useState("In House");
  const [expectedReturn, setExpectedReturn] = useState(""); 
  const [issue_date, setIssueDate] = useState(() => {
    const date = new Date();
    
    const istOffset = 5 * 60 + 30; 
    const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
    const formattedDate = istTime.toISOString().split('.')[0];
    
    return formattedDate;
  });  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [returnTime ,setReturnTime] = useState("");

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!book_id) {
      setErrorMessage("Please enter a valid book title and try again.");
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
      user_id: selectedUser.id,
      book_id,
      issue_date, 
      return_date: returnedAt,
      status: "Issued",
      issuance_type,
    };

    onSubmit(issuanceDetails);
    onClose();
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString().slice(0, 16); 

  return (
    <div className="issuance-form">
      <h2>
        Issue Book to User <br />
        <span>{selectedUser.name}</span>
      </h2>
      <form onSubmit={handleSubmit}>
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
                <li key={book.id} onClick={() => handleSuggestionClick(book)}>
                  {book.title}
                </li>
              ))}
            </ul>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

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
              
              min={todayDate}

            />
          </div>
        )}

        <CustomButton className="submit-button" name="Issue Book" />
      </form>
    </div>
  );
};

export default UserIssuanceform;
