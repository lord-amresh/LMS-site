import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://amresh981806_db_user:fsKxSkymu0MnS1yl@cluster0.8r9arxq.mongodb.net/L-M-S')
        .then(() => {console.log('DB Connected')})
}   