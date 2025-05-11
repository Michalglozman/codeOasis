import axios from 'axios';
import { Author } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getAuthors = async (): Promise<Author[]> => {
  const response = await axios.get(`${API_URL}/authors`);
  return response.data;
};

export const getAuthorById = async (id: string): Promise<Author> => {
  const response = await axios.get(`${API_URL}/authors/${id}`);
  return response.data;
};

export const createAuthor = async (authorData: Omit<Author, 'id'>): Promise<Author> => {
  const response = await axios.post(`${API_URL}/authors`, authorData);
  return response.data;
};

export const updateAuthor = async (id: string, authorData: Partial<Author>): Promise<Author> => {
  const response = await axios.put(`${API_URL}/authors/${id}`, authorData);
  return response.data;
};

export const deleteAuthor = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/authors/${id}`);
};