import { Request, Response } from 'express';
import { Author, Book } from '../models';

export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find().lean();
    
    res.json(authors.map(author => ({
      id: author._id.toString(),
      name: author.name
    })));
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const author = await Author.findById(req.params.id).lean();
    
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    res.json({
      id: author._id.toString(),
      name: author.name
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const newAuthor = new Author({
      name,
    });
    
    const savedAuthor = await newAuthor.save();
    
    res.status(201).json({
      id: savedAuthor._id,
      name: savedAuthor.name,
    });
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    ).lean();
    
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    res.json({
      id: updatedAuthor._id,
      name: updatedAuthor.name,
    });
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const authorId = req.params.id;
    
    const books = await Book.find({ authors: authorId });
    
    for (const book of books) {
      book.authors = book.authors.filter(id => id.toString() !== authorId);
      await book.save();
    }
    
    const deletedAuthor = await Author.findByIdAndDelete(authorId);
    
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchAuthors = async (req: Request, res: Response) => {
  try {
    const nameQuery = req.query.name?.toString().toLowerCase() || '';
    
    const authors = await Author.find({
      name: { $regex: nameQuery, $options: 'i' }
    }).lean();
    
    res.json(authors.map(author => ({
      id: author._id.toString(),
      name: author.name,
    })));
  } catch (error) {
    console.error('Error searching authors:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 