import { Request, Response } from 'express';
import { Book } from '../models';
import { AuthorDocument } from '../models/Author';
import { PublisherDocument } from '../models/Publisher';

export const getAllBooks = async (req: Request, res: Response) => {
    console.log("getAllBooks");
  try {
    if (Object.keys(req.query).length > 0) {
      return await searchBooks(req, res);
    }
    
    const books = await Book.find()
      .populate<{ authors: AuthorDocument[] }>('authors')
      .populate<{ publisher: PublisherDocument }>('publisher')
      .lean();
    
    res.json(books.map(book => ({
      id: book._id.toString(),
      title: book.title,
      description: book.description,
      price: book.price,
      coverImage: book.coverImage,
      publishedYear: book.publishedYear,
      genre: book.genre,
      authors: book.authors?.map(author => ({
        id: author._id.toString(),
        name: author.name
      })) || [],
      publisher: book.publisher ? {
        id: book.publisher._id.toString(),
        name: book.publisher.name
      } : null
    })));
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const titleQuery = req.query.title?.toString().toLowerCase() || '';
    const authorId = req.query.author?.toString();
    const publisherId = req.query.publisher?.toString();
    
    const filter: any = {};
    
    if (titleQuery) {
      filter.title = { $regex: titleQuery, $options: 'i' };
    }
    
    if (authorId) {
      filter.authors = { $in: [authorId] };
    }
    
    if (publisherId) {
      filter.publisher = publisherId;
    }
    console.log(filter);
    const books = await Book.find(filter)
      .populate<{ authors: AuthorDocument[] }>('authors')
      .populate<{ publisher: PublisherDocument }>('publisher')
      .lean();
    
    res.json(books.map(book => ({
      id: book._id.toString(),
      title: book.title,
      description: book.description,
      price: book.price,
      coverImage: book.coverImage,
      publishedYear: book.publishedYear,
      genre: book.genre,
      authors: book.authors?.map(author => ({
        id: author._id.toString(),
        name: author.name
      })) || [],
      publisher: book.publisher ? {
        id: book.publisher._id.toString(),
        name: book.publisher.name
      } : null
    })));
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      price, 
      coverImage, 
      publishedYear, 
      genre,
      authors,
      publisher
    } = req.body;
    
    let authorIds = [];
    if (authors && Array.isArray(authors)) {
      authorIds = authors.map(author => {
        if (typeof author === 'object' && author !== null && 'id' in author) {
          return author.id;
        }
        else if (typeof author === 'string') {
          return author;
        }
        return null;
      }).filter(id => id !== null);
    }

    let publisherId = null;
    if (publisher) {
      if (typeof publisher === 'object' && publisher !== null && 'id' in publisher) {
        publisherId = publisher.id;
      }
      else if (typeof publisher === 'string') {
        publisherId = publisher;
      }
    }
    
    const newBook = new Book({
      title,
      description,
      price,
      coverImage,
      publishedYear,
      genre,
      authors: authorIds,
      publisher: publisherId
    });
    
    const savedBook = await newBook.save();
    
    const populatedBook = await Book.findById(savedBook._id)
      .populate<{ authors: AuthorDocument[] }>('authors')
      .populate<{ publisher: PublisherDocument }>('publisher')
      .lean();
    
    if (!populatedBook) {
      return res.status(404).json({ message: 'Book not found after creation' });
    }
    
    res.status(201).json({
      id: populatedBook._id.toString(),
      title: populatedBook.title,
      description: populatedBook.description,
      price: populatedBook.price,
      coverImage: populatedBook.coverImage,
      publishedYear: populatedBook.publishedYear,
      genre: populatedBook.genre,
      authors: populatedBook.authors?.map(author => ({
        id: author._id.toString(),
        name: author.name
      })) || [],
      publisher: populatedBook.publisher ? {
        id: populatedBook.publisher._id.toString(),
        name: populatedBook.publisher.name
      } : null
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const { authors, publisher, ...otherUpdateData } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      otherUpdateData,
      { new: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (authors && Array.isArray(authors)) {
      const authorIds = authors.map(author => {
        if (typeof author === 'object' && author !== null && 'id' in author) {
          return author.id;
        }
        else if (typeof author === 'string') {
          return author;
        }
        return null;
      }).filter(id => id !== null);
      
      updatedBook.authors = authorIds;
    }
    
    if (publisher !== undefined) {
      if (publisher === null) {
        updatedBook.publisher = undefined;
      } else {
        if (typeof publisher === 'object' && publisher !== null && 'id' in publisher) {
          updatedBook.publisher = publisher.id;
        } 
      }
    }
    
    await updatedBook.save();
    
    const populatedBook = await Book.findById(updatedBook._id)
      .populate<{ authors: AuthorDocument[] }>('authors')
      .populate<{ publisher: PublisherDocument }>('publisher')
      .lean();
    
    if (!populatedBook) {
      return res.status(404).json({ message: 'Book not found after update' });
    }
    
    res.json({
      id: populatedBook._id.toString(),
      title: populatedBook.title,
      description: populatedBook.description,
      price: populatedBook.price,
      coverImage: populatedBook.coverImage,
      publishedYear: populatedBook.publishedYear,
      genre: populatedBook.genre,
      authors: populatedBook.authors?.map(author => ({
        id: author._id.toString(),
        name: author.name
      })) || [],
      publisher: populatedBook.publisher ? {
        id: populatedBook.publisher._id.toString(),
        name: populatedBook.publisher.name
      } : null
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
