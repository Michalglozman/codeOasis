import React, { useState, useEffect, FormEvent } from 'react';
import { Book, Author, Publisher } from '../../types';
import { getAuthors } from '../../services/authorService';
import { getPublishers } from '../../services/publisherService';

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (bookData: Omit<Book, 'id'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading,
  error,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
    initialData.authors?.map(author => author.id) || []
  );
  const [selectedPublisherId, setSelectedPublisherId] = useState<string | undefined>(
    initialData.publisher?.id
  );
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price?.toString() || '');
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [publishedYear, setPublishedYear] = useState(initialData.publishedYear?.toString() || '');
  const [genre, setGenre] = useState(initialData.genre || '');
  
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [authorsData, publishersData] = await Promise.all([
          getAuthors(),
          getPublishers()
        ]);
        setAuthors(authorsData);
        setPublishers(publishersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const priceValue = parseFloat(price);
    const publishedYearValue = publishedYear ? parseInt(publishedYear) : undefined;
    
    if (isNaN(priceValue)) {
      alert('Please enter a valid price');
      return;
    }
    
    if (publishedYear && isNaN(publishedYearValue!)) {
      alert('Please enter a valid year');
      return;
    }
    
    const bookAuthors = authors
      .filter(author => selectedAuthorIds.includes(author.id))
      .map(author => ({ id: author.id, name: author.name }));
    
    const bookPublisher = publishers.find(pub => pub.id === selectedPublisherId);
    
    const bookData: Omit<Book, 'id'> = {
      title,
      authors: bookAuthors,
      description,
      price: priceValue,
      coverImage,
      publisher: bookPublisher ? { id: bookPublisher.id, name: bookPublisher.name } : null,
      ...(publishedYearValue && { publishedYear: publishedYearValue }),
      ...(genre && { genre })
    };
    
    await onSubmit(bookData);
  };
  
  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedAuthorIds(selectedOptions);
  };
  
  const handlePublisherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPublisherId(e.target.value || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
            Authors *
          </label>
          <select
            id="authors"
            multiple
            required
            value={selectedAuthorIds}
            onChange={handleAuthorChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            size={4}
          >
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple authors</p>
        </div>
        
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
            Publisher
          </label>
          <select
            id="publisher"
            value={selectedPublisherId || ''}
            onChange={handlePublisherChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- No Publisher --</option>
            {publishers.map(publisher => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
            Cover Image URL *
          </label>
          <input
            type="url"
            id="coverImage"
            required
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            min="1500"
            max={new Date().getFullYear()}
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {coverImage && (
          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-gray-700 mb-2">Cover Preview</p>
            <div className="w-32 h-48 border border-gray-300 overflow-hidden">
              <img
                src={coverImage}
                alt="Book cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x225?text=Invalid+URL';
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || loading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            (isLoading || loading) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              {initialData.id ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            initialData.id ? 'Update Book' : 'Create Book'
          )}
        </button>
      </div>
    </form>
  );
};

export default BookForm; 