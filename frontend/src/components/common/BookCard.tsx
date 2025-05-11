import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface BookCardProps {
  book: Book;
  onPurchase?: (bookId: string) => void;
  isPurchased?: boolean;
  isAdmin?: boolean;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPurchase,
  isPurchased = false,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handlePurchase = async () => {
    if (onPurchase && !isPurchased) {
      onPurchase(book.id);
    }
  };

  useEffect(() => {
    const descElement = descriptionRef.current;
    if (descElement) {
      const temp = document.createElement('div');
      temp.style.width = `${descElement.clientWidth}px`;
      temp.style.fontSize = '0.875rem'; 
      temp.style.lineHeight = '1.25rem';
      temp.style.maxHeight = '3.75rem'; 
      temp.style.overflow = 'hidden';
      temp.style.position = 'absolute';
      temp.style.visibility = 'hidden';
      temp.style.whiteSpace = 'normal';
      temp.textContent = book.description || "No description available.";
      
      document.body.appendChild(temp);
      const needs = temp.scrollHeight > temp.clientHeight;
      document.body.removeChild(temp);
      
      setNeedsReadMore(needs);
    }
  }, [book.description]);

  const title = book.title || "Untitled Book";
  const authors = book.authors && book.authors.length > 0 
    ? book.authors.map(author => author?.name || "Unknown Author").join(', ')
    : "Unknown Author";
  const publisherName = book.publisher?.name || "Unknown Publisher";
  const description = book.description || "No description available.";
  const price = book.price || 0;
  const genre = book.genre || "General";
  const publishedYear = book.publishedYear || "";

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={book.coverImage || 'https://via.placeholder.com/300x200?text=No+Cover'}
            alt={`${title} cover`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 h-14 line-clamp-2 overflow-hidden" title={title}>
            {title}
          </h3>
          
          <p className="text-gray-600 mb-1 overflow-hidden whitespace-nowrap text-ellipsis">
            by {authors}
          </p>
          
          <p className="text-gray-600 text-sm mb-1 overflow-hidden whitespace-nowrap text-ellipsis">
            Publisher: {publisherName}
          </p>
          
          <p className="text-gray-600 mb-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{genre}</span>
            {publishedYear && <span className="text-sm ml-2">{publishedYear}</span>}
          </p>
          
          <div ref={descriptionRef} className="mb-4 mt-2 text-sm text-gray-700 h-[4.5rem]">
            {needsReadMore ? (
              <div className="relative h-full">
                <p className="line-clamp-2">{description}</p>
                <div className="absolute bottom-0 right-0 text-right w-full">
                  <button 
                    onClick={() => setShowDescriptionModal(true)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Read more
                  </button>
                </div>
              </div>
            ) : (
              <p className="line-clamp-3">{description}</p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">${price.toFixed(2)}</span>
            
            {isAdmin ? (
              <div className="space-x-2">
                <button
                  onClick={() => onEdit && onEdit(book)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete && onDelete(book.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                {isPurchased ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Purchased
                  </span>
                ) : (
                  isAuthenticated && (
                    <button
                      onClick={handlePurchase}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Buy Now
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowDescriptionModal(false)}>
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-gray-700 mb-6">{description}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowDescriptionModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard; 