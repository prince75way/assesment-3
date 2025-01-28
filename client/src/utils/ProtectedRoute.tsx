// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
 
  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  

  const location = useLocation();

  
  const isAuthenticated = isUserAuthenticated;


  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/user/auth" state={{ from: location }} />;
  }
};

export default ProtectedRoute;
