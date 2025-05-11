import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BookForm from '../../components/admin/BookForm';
import { Book } from '../../types';
import { getBookById, updateBook } from '../../services/bookService';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(location.state?.book || null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book && id) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const data = await getBookById(id);
          setBook(data);
          setError(null);
        } catch (err) {
          setError('Failed to load book data. Please try again.');
          console.error('Error fetching book:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [id, book]);

  const handleSubmit = async (bookData: Omit<Book, 'id'>) => {
    if (!id) return;
    
    try {
      setFormLoading(true);
      await updateBook(id, bookData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to update book. Please try again.');
      console.error('Error updating book:', err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!book && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>Book not found. Please return to the dashboard and try again.</p>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </button>
      </div>

      {book && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <BookForm
            initialData={book}
            onSubmit={handleSubmit}
            isLoading={formLoading}
            error={error}
          />
        </div>
      )}
    </div>
  );
};

export default EditBook; 