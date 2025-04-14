import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config();

const testDBConnection = async () => {
    try {
        await connectDB();
        console.log('MongoDB connection test successful');
    } catch (error) {
        console.error('MongoDB connection test failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

testDBConnection();