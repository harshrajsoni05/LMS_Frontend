import './styles/App.css'; 
import LoginPage from './pages/LoginPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BookswithLayout } from './pages/BooksPage';
import { IssuancewithLayout } from './pages/IssuancePage';
import { DashboardwithLayout } from './components/dashboard';
import { CategorywithLayout } from './pages/CategoryPage';
import { UserwithLayout } from './pages/UserPage';
import AdminRoute from './components/adminRoute';  // Import AdminRoute
import UserRoute from './components/userRoute';    // Import UserRoute
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginUser } from './redux/authActions';
import { getCurrentUser } from './api/Auth';
import { UserHistoryWithLayout } from './pages/User/UserHistory';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = window.localStorage.getItem('jwtToken');
    console.log('jwtToken in the getcurrentUser ->', jwtToken);
    
    if (jwtToken) {
      loadUser(jwtToken);
    } else {
      navigate('/');
    }
  }, [dispatch, navigate]);

  const loadUser = async (jwtToken) => {
    try {
      const { data } = await getCurrentUser();
      dispatch(loginUser(data));
      window.localStorage.setItem('jwtToken', data.jwtToken);
      console.log("APP ->", data);
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  }

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />

      <Route 
        path='/category' 
        element={
          <AdminRoute>
            <CategorywithLayout />
          </AdminRoute>
        }
      />

      <Route 
        path='/issuance' 
        element={
          <AdminRoute>
            <IssuancewithLayout />
          </AdminRoute>
        }
      />

      <Route 
        path='/books' 
        element={
          <AdminRoute>
            <BookswithLayout />  
          </AdminRoute>
        }
      />

      <Route 
        path='/dashboard' 
        element={
          <AdminRoute>
            <DashboardwithLayout />
          </AdminRoute>
        } 
      />

      <Route 
        path='/user' 
        element={
          <AdminRoute>
            <UserwithLayout/>
          </AdminRoute>
        }
      />
      <Route 
        path='/userhistory' 
        element={
          <UserRoute>
            <UserHistoryWithLayout />  
          </UserRoute>
        }
      />
    </Routes>
  );
}

export default App;
