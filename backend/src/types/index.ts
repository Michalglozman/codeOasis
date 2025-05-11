export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  publishedYear?: number;
  genre?: string;
  authors: Author[];
  publisher?: Publisher;
}

export interface Author {
  id: string;
  name: string;
}

export interface Publisher {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  purchasedBooks: string[];
}

export interface JWTPayload {
  userId: string;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'user' | 'admin';
} 