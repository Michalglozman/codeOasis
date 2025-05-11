import mongoose, { Document, Schema } from 'mongoose';
import { Book as BookType } from '../types';

export interface BookDocument extends Omit<BookType, 'id' | 'authors' | 'publisher'>, Document {
  authors: mongoose.Types.ObjectId[];
  publisher?: mongoose.Types.ObjectId;
}

const BookSchema = new Schema<BookDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  coverImage: { type: String, required: true },
  publishedYear: { type: Number },
  genre: { type: String },
  authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher' }
}, {
  timestamps: true
});

export const Book = mongoose.model<BookDocument>('Book', BookSchema, 'books'); 