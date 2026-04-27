import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            throw new Error("MONGO_URL is missing ");
        }
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log("DB connection error", error)
        process.exit(1)
    }
}