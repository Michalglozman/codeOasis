import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/common/BookCard';
import AdvancedSearchBar from '../../components/common/AdvancedSearchBar';
import { Book, BookSearchFilters } from '../../types';
import { getBooks, searchBooks, purchaseBook, getPurchasedBooks } from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookSearchFilters>({});
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        setBooks(data);

        if (state.isAuthenticated) {
          const purchasedBooks = await getPurchasedBooks();
          const purchasedIds = purchasedBooks.map(book => book.id);
          setPurchasedBookIds(purchasedIds);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [state.isAuthenticated]);

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

  const handlePurchase = async (bookId: string) => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await purchaseBook(bookId);
      setPurchasedBookIds(prev => [...prev, bookId]);
      navigate('/my-books');
    } catch (err) {
      console.error('Error purchasing book:', err);
    }
  };

  const hasFilters = Object.values(filters).some(value => value && value.trim() !== '');

  const clearSearch = async () => {
    if (hasFilters) {
      setFilters({});
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
    }
  };

  const checkIsPurchased = (bookId: string): boolean => {
    return purchasedBookIds.includes(bookId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to BookShop</h1>
      
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
        <div className="text-center text-gray-600 py-8">
          <p className="text-xl">No books found</p>
          {hasFilters && (
            <p className="mt-2">
              Try different filters or{' '}
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:underline"
              >
                view all books
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
              onPurchase={handlePurchase}
              isPurchased={checkIsPurchased(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 