import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, isAdmin, user } = state;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDisplayName = () => {
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName;
    }
    return isAdmin ? 'Admin' : 'Guest';
  };

  const logoDestination = isAdmin ? '/admin/dashboard' : '/';

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={logoDestination} className="text-xl font-bold">
                BookShop
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!isAdmin && (
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-200"
                >
                  Home
                </Link>
              )}

              {isAuthenticated && !isAdmin && (
                <Link
                  to="/my-books"
                  className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-200"
                >
                  My Books
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-white hover:text-blue-200"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <span className="mr-4">Hello, {getDisplayName()}</span>
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
              >
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <div className="block pl-3 pr-4 py-2 text-base font-medium text-white">
              Hello, {getDisplayName()}
            </div>
            
            {!isAdmin && (
              <Link
                to="/"
                className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link
                to="/my-books"
                className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                My Books
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-white hover:bg-blue-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 