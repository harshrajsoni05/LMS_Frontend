import '../styles/Button.css'

const CustomButton = ({ name, onClick, className }) => {
  return (
    <button 
      onClick={onClick} 
      className={`btn ${className}`}
    >
      {name}
    </button>
  );
};

export default CustomButton;
