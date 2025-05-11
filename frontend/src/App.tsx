import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';

import Home from './pages/user/Home';
import Login from './pages/user/Login';
import MyBooks from './pages/user/MyBooks';

import AdminDashboard from './pages/admin/Dashboard';
import CreateBook from './pages/admin/CreateBook';
import EditBook from './pages/admin/EditBook';
import AuthorsList from './pages/admin/AuthorsList';
import CreateAuthor from './pages/admin/CreateAuthor';
import EditAuthor from './pages/admin/EditAuthor';
import PublishersList from './pages/admin/PublishersList';
import CreatePublisher from './pages/admin/CreatePublisher';
import EditPublisher from './pages/admin/EditPublisher';

const UserOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (state.isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  return state.isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

// Component to handle the root path based on user role
const RootRoute: React.FC = () => {
  const { state } = useAuth();
  
  // If user is admin, redirect to admin dashboard
  if (state.isAuthenticated && state.isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Otherwise show the regular home page
  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/my-books" 
                element={
                  <UserOnlyRoute>
                    <MyBooks />
                  </UserOnlyRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/books/create" 
                element={
                  <AdminRoute>
                    <CreateBook />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/books/edit/:id" 
                element={
                  <AdminRoute>
                    <EditBook />
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/admin/authors" 
                element={
                  <AdminRoute>
                    <AuthorsList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/authors/create" 
                element={
                  <AdminRoute>
                    <CreateAuthor />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/authors/edit/:id" 
                element={
                  <AdminRoute>
                    <EditAuthor />
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/admin/publishers" 
                element={
                  <AdminRoute>
                    <PublishersList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/publishers/create" 
                element={
                  <AdminRoute>
                    <CreatePublisher />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/publishers/edit/:id" 
                element={
                  <AdminRoute>
                    <EditPublisher />
                  </AdminRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-4 text-center">
            <p>&copy; {new Date().getFullYear()} Book Shop. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
