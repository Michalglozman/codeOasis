import { Request, Response } from 'express';
import { User, Book } from '../models';
import { AuthorDocument } from '../models/Author';
import { PublisherDocument } from '../models/Publisher';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email, role: 'user' });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email, role: 'admin' });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ user: safeUser, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const purchaseBook = async (req: Request, res: Response) => {
  const { bookId } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.purchasedBooks.includes(bookId)) {
      return res.status(400).json({ message: 'Book already purchased' });
    }

    user.purchasedBooks.push(bookId);
    await user.save();
    
    res.json({ message: 'Book purchased successfully' });
  } catch (error) {
    console.error('Book purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPurchasedBooks = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const user = await User.findById(req.user.userId).populate<{ purchasedBooks: mongoose.Types.ObjectId[] }>('purchasedBooks');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedBooks = await Promise.all(user.purchasedBooks.map(async (bookId) => {
      const book = await Book.findById(bookId)
        .populate<{ authors: AuthorDocument[] }>('authors')
        .populate<{ publisher: PublisherDocument }>('publisher')
        .lean();
      
      return book ? {
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
      } : null;
    }));
    
    res.json(purchasedBooks);
  } catch (error) {
    console.error('Fetch purchased books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};