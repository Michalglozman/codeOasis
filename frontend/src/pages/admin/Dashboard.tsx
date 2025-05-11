import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/common/BookCard';
import AdvancedSearchBar from '../../components/common/AdvancedSearchBar';
import { Book, BookSearchFilters } from '../../types';
import { getBooks, searchBooks, deleteBook } from '../../services/bookService';

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookSearchFilters>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (newFilters: BookSearchFilters) => {
    setFilters(newFilters);
    try {
      setLoading(true);
      const data = await searchBooks(newFilters);
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasFilters = Object.values(filters).some(value => value && value.trim() !== '');

  const clearSearch = async () => {
    if (hasFilters) {
      setFilters({});
      fetchBooks();
    }
  };

  const handleEdit = (book: Book) => {
    navigate(`/admin/books/edit/${book.id}`, { state: { book } });
  };

  const handleDelete = async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Failed to delete book. Please try again.');
      }
    }
  };

  const handleAddNew = () => {
    navigate('/admin/books/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/admin/authors')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Manage Authors
          </button>
          <button
            onClick={() => navigate('/admin/publishers')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Manage Publishers
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add New Book
          </button>
        </div>
      </div>

      <div className="mb-8">
        <AdvancedSearchBar onSearch={handleSearch} initialFilters={filters} />
        {hasFilters && (
          <div className="mt-2 flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Showing filtered results
            </span>
            <button
              onClick={clearSearch}
              className="ml-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="mt-4 text-xl">No books found</p>
          {hasFilters ? (
            <p className="mt-2">
              Try different filters or{' '}
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:underline"
              >
                view all books
              </button>
            </p>
          ) : (
            <p className="mt-2">
              <button
                onClick={handleAddNew}
                className="text-blue-600 hover:underline"
              >
                Add your first book
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isAdmin={true}
              onEdit={() => handleEdit(book)}
              onDelete={() => handleDelete(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 