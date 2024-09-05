import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/LoadingtoRedirect.css'

const LoadingToRedirect = () => {

    const navigate = useNavigate()
    const [count, setCount] = useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000)

        count === 0 && navigate('/');

        return () => clearInterval(interval);

    }, [count])

  return (
    <div className='redirect-page'>
      <div className="">
        <p>Redirecting you in {count} seconds.</p>
      </div>
    </div>
  )
}

export default LoadingToRedirect