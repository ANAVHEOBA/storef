import app from './app';
import mongoose from 'mongoose';
import { config } from './config';
import { ensureSynapseServiceApproval } from './services/synapse.service';

async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');
        
        // Ensure Synapse service is approved before starting server
        await ensureSynapseServiceApproval();

        // Start the server
        const port = config.port;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('Application startup complete. Ready to accept requests.');
        });
    } catch (error) {
        console.error('Application startup failed:', error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
    process.exit(1);
});

startServer();
