import mongoose from 'mongoose';

const redactMongoUri = (uri: string): string => {
    try {
        const url = new URL(uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://'));
        const host = url.hostname;
        const dbName = url.pathname && url.pathname !== '/' ? url.pathname.slice(1).split('?')[0] : '(default)';
        return `${host}/${dbName}`;
    } catch {
        return '(masked)';
    }
};

export const connectDB = async () => {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
        console.error('[mongo] MONGO_URL is missing in environment');
        process.exit(1);
    }

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
        console.log(`[mongo] connected → ${redactMongoUri(MONGO_URL)}`);
    });
    mongoose.connection.on('error', (error) => {
        console.error('[mongo] connection error', error?.message ?? error);
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('[mongo] disconnected');
    });

    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 15000,
        });
    } catch (error: any) {
        console.error('[mongo] initial connection failed', error?.message ?? error);
        process.exit(1);
    }
};

/**
 * Ensures every Mongoose model registered on the default connection has
 * its indexes synced. Call after connectDB() so MongoDB physically creates
 * collections and unique indexes (otherwise they only appear on first insert).
 */
export const syncIndexes = async () => {
    const modelNames = mongoose.modelNames();
    for (const name of modelNames) {
        try {
            await mongoose.model(name).syncIndexes();
        } catch (error: any) {
            console.warn(`[mongo] syncIndexes failed for ${name}:`, error?.message ?? error);
        }
    }
    console.log(`[mongo] indexes synced for ${modelNames.length} models: ${modelNames.join(', ')}`);
};
