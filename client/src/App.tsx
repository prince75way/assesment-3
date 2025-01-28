import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import useInactivity from './hooks/userInactivity';
import { logout as userLogout } from './redux/slices/userSlice';
import ProtectedRoute from './utils/ProtectedRoute';

// Regular imports
import Basic from './layout/Basic';
import Home from './pages/homepage';
import UserAuth from './pages/userauth';
import AboutPage from './pages/aboutpage';
import Dashboard from './pages/dashboard';
import ChatPage from './pages/chatpage';

// Lazy load only the JoinGroupPage component
const JoinGroupPage = React.lazy(() => import('./pages/joingrouppage'));

const App: React.FC = () => {
  const dispatch = useDispatch();

  const { isAuthenticated: isUserAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useInactivity(30 * 60 * 1000, () => {
    if (isUserAuthenticated) {
      dispatch(userLogout());
      alert('User session expired due to inactivity.');
    }
  });

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Basic />}>
            <Route element={<Home />} path="/" />
            <Route element={<AboutPage />} path="/about" />
            <Route element={<UserAuth />} path="/user/auth" />
            <Route element={<ChatPage />} path="/chat" />
            
            {/* Lazy load only this route */}
            <Route element={<JoinGroupPage />} path="/join-group/:groupId" />
            
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
