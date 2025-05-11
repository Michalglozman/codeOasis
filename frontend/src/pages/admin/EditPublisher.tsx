import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PublisherForm from '../../components/admin/PublisherForm';
import { Publisher } from '../../types';
import { getPublisherById, updatePublisher } from '../../services/publisherService';

const EditPublisher: React.FC = () => {
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPublisher = async () => {
      if (location.state?.publisher) {
        setPublisher(location.state.publisher);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPublisherById(id!);
        setPublisher(data);
        setError(null);
      } catch (err) {
        setError('Failed to load publisher. Please try again later.');
        console.error('Error fetching publisher:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublisher();
  }, [id, location.state]);

  const handleSubmit = async (publisherData: Omit<Publisher, 'id'>) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await updatePublisher(id, publisherData);
      navigate('/admin/publishers');
    } catch (err) {
      setError('Failed to update publisher. Please try again.');
      console.error('Error updating publisher:', err);
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

  if (!publisher && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Publisher not found</p>
        <button
          onClick={() => navigate('/admin/publishers')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Publishers
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Publisher</h1>
        <button
          onClick={() => navigate('/admin/publishers')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Publishers
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <PublisherForm
          initialData={publisher || {}}
          onSubmit={handleSubmit}
          isLoading={submitting}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditPublisher; 