import mongoose, { Document, Schema } from 'mongoose';
import { Publisher as PublisherType } from '../types';

export interface PublisherDocument extends Omit<PublisherType, 'id'>, Document {}

const PublisherSchema = new Schema<PublisherDocument>({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

export const Publisher = mongoose.model<PublisherDocument>('Publisher', PublisherSchema, 'publishers'); 