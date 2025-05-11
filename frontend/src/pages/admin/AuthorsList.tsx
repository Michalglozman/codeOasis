import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Author } from '../../types';
import { getAuthors, deleteAuthor } from '../../services/authorService';

const AuthorsList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await getAuthors();
      setAuthors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load authors. Please try again later.');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (author: Author) => {
    navigate(`/admin/authors/edit/${author.id}`, { state: { author } });
  };

  const handleDelete = async (authorId: string) => {
    if (window.confirm('Are you sure you want to delete this author? This will remove the author from all associated books.')) {
      try {
        await deleteAuthor(authorId);
        setAuthors(authors.filter(author => author.id !== authorId));
      } catch (err) {
        console.error('Error deleting author:', err);
        setError('Failed to delete author. Please try again.');
      }
    }
  };

  const handleAddNew = () => {
    navigate('/admin/authors/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Authors</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add New Author
          </button>
        </div>
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
      ) : authors.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <p className="mt-4 text-xl">No authors found</p>
          <p className="mt-2">
            <button
              onClick={handleAddNew}
              className="text-blue-600 hover:underline"
            >
              Add your first author
            </button>
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {author.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(author)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuthorsList; 