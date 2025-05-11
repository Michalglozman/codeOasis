import axios from 'axios';
import { Publisher } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getPublishers = async (): Promise<Publisher[]> => {
  const response = await axios.get(`${API_URL}/publishers`);
  return response.data;
};

export const getPublisherById = async (id: string): Promise<Publisher> => {
  const response = await axios.get(`${API_URL}/publishers/${id}`);
  return response.data;
};

export const createPublisher = async (publisherData: Omit<Publisher, 'id'>): Promise<Publisher> => {
  const response = await axios.post(`${API_URL}/publishers`, publisherData);
  return response.data;
};

export const updatePublisher = async (id: string, publisherData: Partial<Publisher>): Promise<Publisher> => {
  const response = await axios.put(`${API_URL}/publishers/${id}`, publisherData);
  return response.data;
};

export const deletePublisher = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/publishers/${id}`);
};