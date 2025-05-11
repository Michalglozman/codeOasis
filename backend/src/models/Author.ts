import mongoose, { Document, Schema } from 'mongoose';
import { Author as AuthorType } from '../types';

export interface AuthorDocument extends Omit<AuthorType, 'id'>, Document {}

const AuthorSchema = new Schema<AuthorDocument>({
  name: { type: String, required: true }
}, {
  timestamps: true
});

export const Author = mongoose.model<AuthorDocument>('Author', AuthorSchema, 'authors'); 