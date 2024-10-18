import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb server connected to ${conn.connection.host}`);
    }
    catch(error){
        console.log(`Mongodb connection failed due to ${error.message}`);
        process.exit(1);
    }
}