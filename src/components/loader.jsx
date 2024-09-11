import React, { useEffect, useState } from 'react';
import '../styles/Loader.css'; 
import gif from '../assets/images/Animation - 1725984187044.gif'


  const Loader = ({ loading }) => {
    const [shouldRender, setShouldRender] = useState(false);
  
    useEffect(() => {
      let timer;

      if (loading) {
        setShouldRender(true); 
      } else {
        timer = setTimeout(() => {setShouldRender(false);}, 1000); 
      }
  
      return () => clearTimeout(timer);
    }, [loading]);
  
    if (!shouldRender) return null;
  
  return (
    <div className="loader-container">
      <img src={gif} alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;
