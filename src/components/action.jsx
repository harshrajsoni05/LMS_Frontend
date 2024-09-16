import '../styles/Action.css';
import allotIcon from '../assets/images/alloticon.png'; 
import editIcon from '../assets/images/editicon.png';   
import deleteIcon from '../assets/images/deleteicon.png'; 

function Action({ onAllot, onEdit, onDelete }) {
    return (
      <div className="action-buttons">
        <img
          src={allotIcon}
          alt="Allot Book"
          className="action-icon"
          onClick={onAllot}
        />
        <img
          src={editIcon}
          alt="Edit"
          className="action-icon"
          onClick={onEdit}
        />
        <img
          src={deleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={onDelete}
        />
      </div>
    );
  }
  

export default Action;
