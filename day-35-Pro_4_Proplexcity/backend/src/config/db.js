import mongoose from "mongoose";

export async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo_DB connected....")
    } catch (error) {
        throw new Error("DB Connection failed!: "+ error)
    }
}