import app from './app';
import mongoose from 'mongoose';
import { config } from './config';

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Start the server
        const port = config.port;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});

