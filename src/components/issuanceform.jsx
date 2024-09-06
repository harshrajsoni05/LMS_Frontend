import { useState } from "react";
import "../styles/Issuanceform.css";
import { SearchByNumber as findUserByMobile } from "../api/UserServices";
import { formatTimestamp } from "../components/utils";
import CustomButton from "../components/button";

const IssuanceForm = ({ onSubmit, selectedBook, onClose }) => {
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [user_id, setuser_id] = useState(null);
  const [issuance_type, setIssuanceType] = useState("Home");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [issuedAt] = useState(new Date());
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
    if (!user_id) {
      setErrorMessage("Please enter a valid mobile number and try again.");
      return;
    }

    let returnedAt = null;
    if (issuance_type === "Home" && returnDate) {
      returnedAt = formatTimestamp(`${returnDate} 23:59:59`);
    } else if (issuance_type === "Library" && returnTime) {
      const currentDate = new Date().toISOString().slice(0, 10);
      returnedAt = formatTimestamp(`${currentDate} ${returnTime}`);
    }

    const issuanceDetails = {
      user_id,
      book_id: selectedBook.id,
      issue_date:expectedReturn, //formatTimestamp(issuedAt), // Format issuedAt to the required format
      return_date:expectedReturn,//formatTimestamp(expectedReturn),
      status: "Issued",
      issuance_type,
    };

    onSubmit(issuanceDetails);
    onClose();
  };

  return (
    <div className="issuance-form">
      <h2>
        Issue Book <br />
        <span>{selectedBook.title}</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            value={userMobileNumber}
            onChange={handleMobileNumberChange}
            placeholder="Enter User Mobile Number"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="form-group">
          <label>Issuance Type</label>
          <select
            value={issuance_type}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="In House">In house</option>
            <option value="Library">Library</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expected Return</label>
          <input
            type="datetime-local"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            required
          />
        </div>
        <CustomButton className="submit-button" name="Issue Book" />
      </form>
    </div>
  );
};

export default IssuanceForm;
