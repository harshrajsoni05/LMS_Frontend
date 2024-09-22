import { useSelector } from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect.jsx';

const UserRoute = ({children, ...rest}) => {

  const auth = useSelector((state) => state.auth);
 
  return auth.role === "ROLE_USER" && auth.jwtToken 
    ? children 
    : <div className="">
        <LoadingToRedirect />
      </div>
}

export default UserRoute
