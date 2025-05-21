import mongoose from 'mongoose';

const guessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guess: { type: String, enum: ['male', 'female'], required: true },
  message: { type: String }
}, { timestamps: true });

export const Guess = mongoose.model('Guess', guessSchema);
