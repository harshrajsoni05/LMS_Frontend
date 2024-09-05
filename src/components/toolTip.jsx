import '../styles/Tooltip.css'; // Import the CSS for styling the tooltip

const Tooltip = ({ children, message }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{message}</span>
    </div>
  );
};

export default Tooltip;