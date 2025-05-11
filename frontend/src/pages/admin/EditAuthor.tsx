import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AuthorForm from '../../components/admin/AuthorForm';
import { Author } from '../../types';
import { getAuthorById, updateAuthor } from '../../services/authorService';

const EditAuthor: React.FC = () => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (location.state?.author) {
        setAuthor(location.state.author);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAuthorById(id!);
        setAuthor(data);
        setError(null);
      } catch (err) {
        setError('Failed to load author. Please try again later.');
        console.error('Error fetching author:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, location.state]);

  const handleSubmit = async (authorData: Omit<Author, 'id'>) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await updateAuthor(id, authorData);
      navigate('/admin/authors');
    } catch (err) {
      setError('Failed to update author. Please try again.');
      console.error('Error updating author:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!author && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Author not found</p>
        <button
          onClick={() => navigate('/admin/authors')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Authors
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Author</h1>
        <button
          onClick={() => navigate('/admin/authors')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Authors
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <AuthorForm
          initialData={author || {}}
          onSubmit={handleSubmit}
          isLoading={submitting}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditAuthor; 