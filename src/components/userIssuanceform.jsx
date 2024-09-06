import { useState } from "react";
import { findBookSuggestions } from "../api/BookServices";
import "../styles/Issuanceform.css";
import Button from "./button";
import { formatTimestamp } from "./utils";

const UserIssuanceform = ({ onSubmit, selectedUser, onClose }) => {
  const [bookTitle, setBookTitle] = useState("");
  const [book_id, setBookId] = useState(null);
  const [issuance_type, setIssuanceType] = useState("In House");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(formatTimestamp(new Date().toLocaleString())); //
  const [expectedReturn, setExpectedReturn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookSuggestions, setBookSuggestions] = useState([]);

  const fetchBookSuggestions = async (query) => {
    if (query.length < 2) {
      setBookSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const suggestions = await findBookSuggestions(query);
      console.log("Suggestions: ", suggestions);
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
      setErrorMessage("Please enter a valid Title and try again.");
      return;
    }
    let returnedAt = null;
    if (issuance_type === "Home" && expectedReturn) {
      returnedAt = formatTimestamp(new Date(expectedReturn).toLocaleString());
    }
    else if (issuance_type === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10);
      returnedAt = formatTimestamp(
        new Date(`${currentDate}T${returnTime}`).toLocaleString()
      );
    }
    const issuanceDetails = {
      user_id: selectedUser.id,
      book_id,
      issue_date: null,
      return_date: returnedAt,
      status: "Issued",
      issuance_type,
    };
    console.log(issuanceDetails);
    onSubmit(issuanceDetails);
    onClose();
  };
  return (
    <div className="issuance-form">
      <h2>
        Issue User <br />
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
            <option value="Home">Home</option>
            <option value="Library">Library</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expected Return</label>
          {issuance_type === "Library" ? (
            <input
              type="datetime-local"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              required
            />
          ) : (
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              required={issuance_type === "In House"}
            />
          )}
        </div>
        <Button className="submit-button" text="Issue Book" />
      </form>
    </div>
  );
};
export default UserIssuanceform;
