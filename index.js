import express from "express";
import connectDB from "./config/db.js";
// import viewRouter from "./routes/viewRouter.js";
import cors from "cors"
import authRouter from "./routes/authRouter.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// Routes
app.use("/api/auth", authRouter);
// app.use("/", viewRouter);
const PORT = process.env.PORT || 5000;
 if(process.env.NODE_ENV !== "production"){
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
 }
 export default app;