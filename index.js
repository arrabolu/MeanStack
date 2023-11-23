import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import roleRoute from "./routes/Role.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import cors from 'cors';


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  orgin : 'http://localhost:4200',
  crendentials : true
}));
app.use('/api/role', roleRoute)
app.use('/api/auth',authRoute)
app.use('/api/users', userRoute);


// Response handler middleware

app.use((obj,req,res,next)=>{
  const statusCode = obj.status || 500;
  const message = obj.message || " Something went wrong !!"

  return res.status(statusCode).json({
    success : [200,201,204].some(a => obj.status === a ) ? true : false,
    status : statusCode,
    message : message,
    data : obj.data,
    stack : obj.stack
  });
})


app.use('/api/login',(req,res)=>{
   return res.send("<h1>Login Success!!!</h1>");
})

// app.use('/api/register',(req,res)=>{
  //     return res.send("<h1>Register Success!!</h1>");
  // })
  
  // app.use('/',(req,res)=>{
    //     res.send("<h1>Hello World this is my first express js ap!!!!!!!!!!!</h1>");
    // })
    
    
    // DB Connection
    
    const connectMongoDB = async () => {
      try {
        console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Connected to MongoDB");
      } catch (err) {
        console.log(err.message);
        throw err;
      }
    };
    
    app.listen(8080, () => {
  connectMongoDB();
  console.log("server is running");
});
