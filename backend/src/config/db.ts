import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB(): Promise<void> {
  let uri = ENV.MONGO_URI;
  // If MONGO_USER + MONGO_PASS set, build and encode
  if (!uri && process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_HOST) {
    const user = encodeURIComponent(process.env.MONGO_USER);
    const pass = encodeURIComponent(process.env.MONGO_PASS);
    uri = `mongodb+srv://${user}:${pass}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;
  }

  if (!uri) throw new Error('MONGO_URI (or MONGO_USER/MONGO_PASS/MONGO_HOST) is not set');

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
