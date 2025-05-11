import React, { useState, useEffect, FormEvent } from 'react';
import { BookSearchFilters, Author, Publisher } from '../../types';
import { getAuthors } from '../../services/authorService';
import { getPublishers } from '../../services/publisherService';

interface AdvancedSearchBarProps {
  onSearch: (filters: BookSearchFilters) => void;
  initialFilters?: BookSearchFilters;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({ 
  onSearch,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<BookSearchFilters>(initialFilters);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [authorsData, publishersData] = await Promise.all([
          getAuthors(),
          getPublishers()
        ]);
        setAuthors(authorsData);
        setPublishers(publishersData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onSearch({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex items-center mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="title"
            placeholder="Search by title..."
            value={filters.title || ''}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Search
          </button>
        </div>

        <div className="flex justify-center mb-2">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                Author
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="author"
                name="author"
                value={filters.author || ''}
                onChange={handleInputChange}
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
                Publisher
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="publisher"
                name="publisher"
                value={filters.publisher || ''}
                onChange={handleInputChange}
              >
                <option value="">All Publishers</option>
                {publishers.map(publisher => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearchBar; 