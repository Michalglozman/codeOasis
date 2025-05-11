import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorForm from '../../components/admin/AuthorForm';
import { Author } from '../../types';
import { createAuthor } from '../../services/authorService';

const CreateAuthor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (authorData: Omit<Author, 'id'>) => {
    try {
      setLoading(true);
      await createAuthor(authorData);
      navigate('/admin/authors');
    } catch (err) {
      setError('Failed to create author. Please try again.');
      console.error('Error creating author:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Author</h1>
        <button
          onClick={() => navigate('/admin/authors')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Authors
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <AuthorForm
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateAuthor; 