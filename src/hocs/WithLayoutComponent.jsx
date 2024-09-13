import Header from '../components/header'; 
import Sidebar from '../components/sidebar';
import '../styles/Hoc.css';

const HOC = (Component) => {
  return function Hoc(props) {
    return (
      <div>
        <Header/>
        <div className='dashboard-hoc-container'>
          <Sidebar/>
          <div className='dashboard-hoc-right-container'>
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  };
};

export default HOC;
