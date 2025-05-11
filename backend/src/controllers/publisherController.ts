import { Request, Response } from 'express';
import { Publisher, Book } from '../models';

export const getAllPublishers = async (req: Request, res: Response) => {
  try {
    const publishers = await Publisher.find().lean();
    
    res.json(publishers.map(publisher => ({
      id: publisher._id.toString(),
      name: publisher.name
    })));
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublisherById = async (req: Request, res: Response) => {
  try {
    const publisher = await Publisher.findById(req.params.id).lean();
    
    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    
    res.json({
      id: publisher._id.toString(),
      name: publisher.name
    });
  } catch (error) {
    console.error('Error fetching publisher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPublisher = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const newPublisher = new Publisher({
      name,
    });
    
    const savedPublisher = await newPublisher.save();
    
    res.status(201).json({
      id: savedPublisher._id,
      name: savedPublisher.name,
    });
  } catch (error) {
    console.error('Error creating publisher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePublisher = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      {
        name,
      },
      { new: true }
    ).lean();
    
    if (!updatedPublisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    
    res.json({
      id: updatedPublisher._id,
      name: updatedPublisher.name,
    });
  } catch (error) {
    console.error('Error updating publisher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePublisher = async (req: Request, res: Response) => {
  try {
    const publisherId = req.params.id;
    
    const books = await Book.find({ publisher: publisherId });
    
    for (const book of books) {
      book.publisher = undefined;
      await book.save();
    }
    
    const deletedPublisher = await Publisher.findByIdAndDelete(publisherId);
    
    if (!deletedPublisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    
    res.json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    console.error('Error deleting publisher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchPublishers = async (req: Request, res: Response) => {
  try {
    const nameQuery = req.query.name?.toString().toLowerCase() || '';
    
    const publishers = await Publisher.find({
      name: { $regex: nameQuery, $options: 'i' }
    }).lean();
    
    res.json(publishers.map(publisher => ({
      id: publisher._id.toString(),
      name: publisher.name,
    })));
  } catch (error) {
    console.error('Error searching publishers:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 