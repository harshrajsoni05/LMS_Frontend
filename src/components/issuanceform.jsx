import { useState } from "react";
import "../styles/Issuanceform.css";
import { SearchByNumber as findUserByMobile } from "../api/UserServices";
import { formatTimestamp } from "../components/utils";
import CustomButton from "../components/button";

const IssuanceForm = ({ onSubmit, selectedBook, onClose }) => {
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [user_id, setuser_id] = useState(null);
  const [issuance_type, setIssuanceType] = useState("In House");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserDetails = async (mobileNumber) => {
    try {
      const userDetails = await findUserByMobile(mobileNumber);
      if (userDetails.content && userDetails.content.length > 0) {
        const user = userDetails.content[0];
        setuser_id(user.id);
        setErrorMessage("");
      } else {
        setuser_id(null);
        setErrorMessage("User not found. Please register first.");
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setuser_id(null);
      setErrorMessage("User not found. Please register first.");
    }
  };

  const handleMobileNumberChange = (e) => {
    const mobileNumber = e.target.value;
    setUserMobileNumber(mobileNumber);
    if (mobileNumber.length >= 10) {
      fetchUserDetails(mobileNumber);
    } else {
      setuser_id(null);
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!userMobileNumber || userMobileNumber.length < 10) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }
    
    if (!user_id) {
      setErrorMessage("User not found. Please enter a valid mobile number.");
      return;
    }

    if (!expectedReturn) {
      setErrorMessage("Please enter the expected return details.");
      return;
    }

    let returnedAt = null;
    if (issuance_type === "In House" && expectedReturn) {
        returnedAt = formatTimestamp(expectedReturn); 
    } else if (issuance_type === "Library" && expectedReturn) {
        const currentDate = new Date().toISOString().slice(0, 10); 
        returnedAt = formatTimestamp(`${currentDate}T${expectedReturn}`); 
    }

    const issuanceDetails = {
      user_id,
      book_id: selectedBook.id,
      issue_date: new Date(),
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
        Issue Book <br />
        <span>{selectedBook.title}</span>
      </h2>
      <form onSubmit={handleSubmit}>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={userMobileNumber}
            onChange={handleMobileNumberChange}
            placeholder="Enter User Mobile Number"
          />
          
        </div>
        <div className="form-group">
          <label>Issuance Type</label>
          <select
            value={issuance_type}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="In House">Takeway</option>
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
              min={todayDate}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Expected Return Time</label>
            <input
              type="time"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
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
