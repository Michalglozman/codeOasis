import React, { useState, useEffect } from 'react';
import BookCard from '../../components/common/BookCard';
import { Book } from '../../types';
import { getPurchasedBooks } from '../../services/bookService';

const MyBooks: React.FC = () => {
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const data = await getPurchasedBooks();
        setPurchasedBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load your books. Please try again later.');
        console.error('Error fetching purchased books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Books</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : purchasedBooks.length === 0 ? (
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
          <p className="mt-4 text-xl">You haven't purchased any books yet</p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 hover:underline">
              Browse our collection
            </a>
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchasedBooks.map((book) => (
              <div key={book.id} className="flex flex-col">
                <BookCard
                  book={book}
                  isPurchased={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks; 