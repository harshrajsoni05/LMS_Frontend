import { useSelector } from 'react-redux';
import Header from '../components/header'; 
import Sidebar from '../components/sidebar';
import './Hoc.css';

const WithLayoutComponent = (Component) => {
  return function Hoc(props) {

    const role = useSelector((state) => state.auth.role); 
    const Name = useSelector((state) => state.auth.name); 

    return (
      <div>
        <Header role={role} userName={Name} />
        <div className='dashboard-hoc-container'>
          <Sidebar role={role} />
          <div className='dashboard-hoc-right-container'>
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  };
};

export default WithLayoutComponent;
