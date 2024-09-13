import '../styles/Loader.css'; 
import gif from '../assets/images/Animation - 1725984187044.gif'


const Loader = () => {
  
  return (
    <div className="loader-container">
      <img src={gif} alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;
