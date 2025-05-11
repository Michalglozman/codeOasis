import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../../components/admin/BookForm';
import { Book } from '../../types';
import { createBook } from '../../services/bookService';

const CreateBook: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (bookData: Omit<Book, 'id'>) => {
    try {
      setLoading(true);
      await createBook(bookData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to create book. Please try again.');
      console.error('Error creating book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Book</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <BookForm
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateBook; 