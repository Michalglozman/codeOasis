import React, { useState, FormEvent } from 'react';
import { Publisher } from '../../types';

interface PublisherFormProps {
  initialData?: Partial<Publisher>;
  onSubmit: (publisherData: Omit<Publisher, 'id'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const PublisherForm: React.FC<PublisherFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading,
  error,
}) => {
  const [name, setName] = useState(initialData.name || '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Publisher name is required');
      return;
    }
    
    const publisherData: Omit<Publisher, 'id'> = {
      name
    };
    
    await onSubmit(publisherData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              {initialData.id ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            initialData.id ? 'Update Publisher' : 'Create Publisher'
          )}
        </button>
      </div>
    </form>
  );
};

export default PublisherForm; 