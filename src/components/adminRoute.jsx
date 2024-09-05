import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './loadingToRedirect.jsx';

const AdminRoute = ({children, ...rest}) => {

  const auth = useSelector((state) => state.auth);
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    if (auth && auth.jwtToken) {
      try {
        if (auth.role  === 'ROLE_ADMIN') {
          setVerified(true);
        }
      } catch (error) {
        console.log('ADMIN ROUTE ERR', error);
        setVerified(false);
      }
    }
  }, [auth])

  return verified 
    ? children 
    : <div className="">
        <LoadingToRedirect />
      </div>
}

export default AdminRoute