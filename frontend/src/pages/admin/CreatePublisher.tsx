import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublisherForm from '../../components/admin/PublisherForm';
import { Publisher } from '../../types';
import { createPublisher } from '../../services/publisherService';

const CreatePublisher: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (publisherData: Omit<Publisher, 'id'>) => {
    try {
      setLoading(true);
      await createPublisher(publisherData);
      navigate('/admin/publishers');
    } catch (err) {
      setError('Failed to create publisher. Please try again.');
      console.error('Error creating publisher:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Publisher</h1>
        <button
          onClick={() => navigate('/admin/publishers')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Publishers
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <PublisherForm
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreatePublisher; 