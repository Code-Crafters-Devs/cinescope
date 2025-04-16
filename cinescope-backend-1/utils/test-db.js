import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

process.env.MONGO_URI = 'mongodb+srv://new-user_01:Masingita%4096m@cinescope.xn6zw0q.mongodb.net/myDatabase?retryWrites=true&w=majority';

const testDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
        console.log('MongoDB connection test successful');
    } catch (error) {
        console.error('MongoDB connection test failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

testDBConnection();