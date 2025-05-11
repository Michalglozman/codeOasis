import { Book, User } from '../types';
import bcrypt from 'bcryptjs';

export const books: Book[] = [
  {
    id: '1',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first book in the Harry Potter series following the life of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley.',
    price: 19.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg',
    publishedYear: 1997,
    genre: 'Fantasy'
  },
  {
    id: '2',
    title: 'A Game of Thrones',
    author: 'George R.R. Martin',
    description: 'The first book in A Song of Ice and Fire series - a tale of lords and ladies, soldiers and sorcerers, assassins and bastards, who come together in a time of grim omens.',
    price: 24.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91dSMhdIzTL.jpg',
    publishedYear: 1996,
    genre: 'Fantasy'
  },
  {
    id: '3',
    title: 'The Shining',
    author: 'Stephen King',
    description: 'A horror novel by Stephen King about a family that heads to an isolated hotel for the winter where a sinister presence influences the father into violence.',
    price: 15.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71RvY-PzP9L.jpg',
    publishedYear: 1977,
    genre: 'Horror'
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel that tells the story of Winston Smith and his attempt to rebel against the totalitarian state in which he lives.',
    price: 12.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
    publishedYear: 1949,
    genre: 'Dystopian'
  },
  {
    id: '5',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about a lawyer in the Deep South defending a Black man accused of rape, as seen through the eyes of his daughter Scout.',
    price: 14.99,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg',
    publishedYear: 1960,
    genre: 'Fiction'
  }
];

const adminPassword = bcrypt.hashSync('admin123', 10);
const userPassword = bcrypt.hashSync('user123', 10);

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
    purchasedBooks: []
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: userPassword,
    role: 'user',
    purchasedBooks: []
  }
];

const findBooksByAuthor = async (authorId: string) => {
  try {
    const books = await Book.find({ authors: authorId })
      .populate('publisher')
      .lean();
    return books;
  } catch (error) {
    console.error('Error finding books by author:', error);
    throw error;
  }
};

const findBooksByPublisher = async (publisherId: string) => {
  try {
    const books = await Book.find({ publisher: publisherId })
      .populate('authors')
      .lean();
    return books;
  } catch (error) {
    console.error('Error finding books by publisher:', error);
    throw error;
  }
};

const findBooksByGenre = async (genre: string) => {
  try {
    const books = await Book.find({ genre: { $regex: genre, $options: 'i' } })
      .populate('authors')
      .populate('publisher')
      .lean();
    return books;
  } catch (error) {
    console.error('Error finding books by genre:', error);
    throw error;
  }
};

const findBooksByPriceRange = async (minPrice: number, maxPrice: number) => {
  try {
    const books = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice }
    })
      .populate('authors')
      .populate('publisher')
      .sort({ price: 1 })
      .lean();
    return books;
  } catch (error) {
    console.error('Error finding books by price range:', error);
    throw error;
  }
};

const findLatestBooks = async (limit: number = 5) => {
  try {
    const books = await Book.find()
      .sort({ publishedYear: -1 })
      .limit(limit)
      .populate('authors')
      .populate('publisher')
      .lean();
    return books;
  } catch (error) {
    console.error('Error finding latest books:', error);
    throw error;
  }
};

const searchBooks = async (searchTerm: string) => {
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate('authors')
      .populate('publisher')
      .lean();
    return books;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

const getAuthorsWithBookCount = async () => {
  try {
    const authors = await Author.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'authors',
          as: 'books'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          biography: 1,
          birthDate: 1,
          nationality: 1,
          website: 1,
          bookCount: { $size: '$books' }
        }
      },
      { $sort: { bookCount: -1 } }
    ]);
    return authors;
  } catch (error) {
    console.error('Error getting authors with book count:', error);
    throw error;
  }
}; 