import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user"

const app = express();
dotenv.config({ path: ".env" });
app.use(express.json());
mongoose.set('strictQuery', false);

//ROUTES
app.use("/user",userRoutes);

//PORT SETUP
const PORT = process.env.PORT || 4451;
const URI = process.env.MONGO_URI;

//PORT LISTENING
app.listen(PORT, () => {
    console.log(`PORT CONNECTED`);
});

mongoose.connect(URI!).then(() => {
    console.log("MONGO-DB CONNECTED");
})