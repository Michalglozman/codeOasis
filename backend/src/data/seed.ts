import { Book, Author, Publisher } from '../models';
import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from './db';

const seedDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();
    
    // Clear existing data
    await Book.deleteMany({});
    await Author.deleteMany({});
    await Publisher.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create publishers
    const publishers = await Publisher.create([
      { name: 'Bloomsbury' },
      { name: 'Bantam Spectra' },
      { name: 'Doubleday' },
      { name: 'Secker & Warburg' },
      { name: 'J. B. Lippincott & Co.' }
    ]);
    
    console.log(`Inserted ${publishers.length} publishers`);

    // Create authors
    const authors = await Author.create([
      { name: 'J.K. Rowling' },
      { name: 'George R.R. Martin' },
      { name: 'Stephen King' },
      { name: 'George Orwell' },
      { name: 'Harper Lee' }
    ]);
    
    console.log(`Inserted ${authors.length} authors`);

    // Create books with references to authors and publishers
    const books = [
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        description: 'The first book in the Harry Potter series following the life of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley.',
        price: 19.99,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg',
        publishedYear: 1997,
        genre: 'Fantasy',
        authors: [authors[0]._id], // J.K. Rowling
        publisher: publishers[0]._id // Bloomsbury
      },
      {
        title: 'A Game of Thrones',
        description: 'The first book in A Song of Ice and Fire series - a tale of lords and ladies, soldiers and sorcerers, assassins and bastards, who come together in a time of grim omens.',
        price: 24.99,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91dSMhdIzTL.jpg',
        publishedYear: 1996,
        genre: 'Fantasy',
        authors: [authors[1]._id], // George R.R. Martin
        publisher: publishers[1]._id // Bantam Spectra
      },
      {
        title: 'The Shining',
        description: 'A horror novel by Stephen King about a family that heads to an isolated hotel for the winter where a sinister presence influences the father into violence.',
        price: 15.99,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71RvY-PzP9L.jpg',
        publishedYear: 1977,
        genre: 'Horror',
        authors: [authors[2]._id], // Stephen King
        publisher: publishers[2]._id // Doubleday
      },
      {
        title: '1984',
        description: 'A dystopian novel that tells the story of Winston Smith and his attempt to rebel against the totalitarian state in which he lives.',
        price: 12.99,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
        publishedYear: 1949,
        genre: 'Dystopian',
        authors: [authors[3]._id], // George Orwell
        publisher: publishers[3]._id // Secker & Warburg
      },
      {
        title: 'To Kill a Mockingbird',
        description: 'A novel about a lawyer in the Deep South defending a Black man accused of rape, as seen through the eyes of his daughter Scout.',
        price: 14.99,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg',
        publishedYear: 1960,
        genre: 'Fiction',
        authors: [authors[4]._id], // Harper Lee
        publisher: publishers[4]._id // J. B. Lippincott & Co.
      }
    ];

    const insertedBooks = await Book.create(books);
    console.log(`Inserted ${insertedBooks.length} books`);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await disconnectFromDatabase();
  }
};

// Run the seed function
seedDatabase()
  .then(() => console.log('Seeding complete'))
  .catch(err => console.error('Seeding failed:', err)); 