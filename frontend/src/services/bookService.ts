import axios from 'axios';
import { Book, BookSearchFilters } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get(`${API_URL}/books`);
  return response.data;
};

export const searchBooks = async (filters: BookSearchFilters): Promise<Book[]> => {
  const queryParams = new URLSearchParams();
  
  if (filters.title) {
    queryParams.append('title', filters.title);
  }
  
  if (filters.author) {
    queryParams.append('author', filters.author);
  }
  
  if (filters.publisher) {
    queryParams.append('publisher', filters.publisher);
  }
  
  const response = await axios.get(`${API_URL}/books?${queryParams.toString()}`);
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await axios.get(`${API_URL}/books/${id}`);
  return response.data;
};

export const createBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  const response = await axios.post(`${API_URL}/books`, bookData);
  return response.data;
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  const response = await axios.put(`${API_URL}/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/books/${id}`);
};

export const purchaseBook = async (bookId: string): Promise<Book> => {
  const response = await axios.post(`${API_URL}/user/books/purchase`, { bookId });
  return response.data;
};

export const getPurchasedBooks = async (): Promise<Book[]> => {
  const response = await axios.get(`${API_URL}/user/books/purchased`);
  return response.data;
}; 