import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '../types';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Omit<UserType, 'id' | 'purchasedBooks'>, Document {
  purchasedBooks: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  purchasedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<UserDocument>('User', UserSchema); 