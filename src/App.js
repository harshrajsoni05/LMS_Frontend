import './styles/App.css'; 
import LoginPage from './pages/LoginPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import { IssuancewithLayout } from './pages/IssuancePage';
import { DashboardwithLayout } from './components/dashboard';
import CategoryPage from './pages/CategoryPage';
import { UserwithLayout } from './pages/UserPage';
import AdminRoute from './components/adminRoute';  
import UserRoute from './components/userRoute';    
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginUser } from './redux/authActions';
import { getCurrentUser } from './api/Auth';
import { UserHistoryWithLayout } from './pages/User/UserHistory';
import { HistoryWithLayout } from './pages/History';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = window.localStorage.getItem('jwtToken');
    
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
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  }

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />

      <Route path='/category' element={
          <AdminRoute>
            <CategoryPage />
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
            <BooksPage />  
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
        path='/history/:bookId' 
        element={
          <AdminRoute>
            <HistoryWithLayout />  
          </AdminRoute>
        }
      />
      <Route 
        path='/history/book/:bookId' 
        element={
          <AdminRoute>
            <HistoryWithLayout />  
          </AdminRoute>
        }
      />
      <Route 
        path='/history/user/:userId' 
        element={
          <AdminRoute>
            <HistoryWithLayout />  
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
