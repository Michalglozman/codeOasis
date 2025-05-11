import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginCredentials, User } from '../types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getUserFromLocalStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromLocalStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: localStorage.getItem('userRole') === 'admin',
  loading: false,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isAdmin: action.payload.user.role === 'admin',
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
      
      if (state.user) {
        localStorage.setItem('userRole', state.user.role);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      const endpoint = credentials.role === 'admin' 
        ? `${API_URL}/user/auth/admin/login` 
        : `${API_URL}/user/auth/login`;
      
      const response = await axios.post(endpoint, credentials);
      const { user, token } = response.data;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};