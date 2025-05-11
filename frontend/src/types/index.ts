export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Author {
  id: string;
  name: string;
  books?: Pick<Book, 'id' | 'title'>[];
}

export interface Publisher {
  id: string;
  name: string;
  books?: Pick<Book, 'id' | 'title'>[];
}

export interface Book {
  id: string;
  title: string;
  authors: Author[];
  description: string;
  price: number;
  coverImage: string;
  publishedYear?: number;
  genre?: string;
  publisher?: Publisher | null;
}

export interface BookSearchFilters {
  title?: string;
  author?: string;
  publisher?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}