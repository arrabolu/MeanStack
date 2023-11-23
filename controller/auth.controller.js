import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import { createSuccess } from "../utils/success.js";
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";
import nodemailer from 'nodemailer'

export const createUser = async (req, res, next) => {
  try {
    const role = await Role.find({ role: "User" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    if (req.body.firstName !== "" && req.body.firstName) {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        roles: role,
      });

      await newUser.save();
      return next(createSuccess(200, "User Registerd successfully", newUser));
    } else {
      return next(createError(400, "Bad Request !!"));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );

    const { roles } = user;
    if (!user) {
      return next(createError(404, "User Not Found !!"));
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      return next(createError(400, "Incorrect Password !!"));
    } else {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, roles: roles },
        process.env.SECRET_KET
      );
      res.cookie("access-token", token);
      return res.status(200).json({
        Success: true,
        message: "Login Success!!",
        data: user,
      });

      //   return next(createSuccess(200, "Login Success !!"));
    }
  } catch (error) {
    return next(createError(500, "Internal Server Error !!"));
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const role = await Role.find({});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    if (req.body.firstName || req.body.firstName != "") {
      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        isAdmin: true,
        roles: role,
      });
      await newUser.save();

      return next(createSuccess(200, "Admin created successfully", newUser));
    } else {
      return next(createError(400, "Bad request"));
    }
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }


};


export const forgetPassword = async (req,res,next) => {
        const email = req.body.email ;
        const user = await User.findOne({ email : { $regex : '^'+email+'$', $options : 'i' } });

        if(!user){
          return next(createError( 404 , "User not found to reset password"));
        }

        const payload = {
          email : user.email
        }
        const expiryTime = 500
        const token = jwt.sign(payload,process.env.SECRET_KET,{expiresIn : expiryTime});

        const newToken = new UserToken({
          userId : user._id,
          token : token
        })

        const mailTransporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
              user : 'saivinayreddy212@gmail.com',
              pass : 'mfxcsbwizvdtfbzn',
            }
        });

        const mailDetails = {
          from : 'saivinayreddy212@gmail.com',
          to : user.email,
          subject : 'Reset Password Link',
          html : `
  <html> 
     <head> 
     <title>Password Reset Request</title> 
     </head> 
      <body> <h1>Password Reset Request</h1>
           <p>Dear ${user.firstName}.</p> 
           <p>We have received a request to reset your password for your account with Book Book. 
           To complete the password reset process, please click on the button below:</p>
            <a href=${process.env.LIVE_URL}/reset/${token}<button style="background-color: #4CAF50; 
            color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a> 
            <p>Please note that this link is only valid for a 5 Mins. If you did not request a password reset, please disregard this message.</p>
         <p>Thank you,</p> 
     </body> 
  </html>
          `
        }

        mailTransporter.sendMail(mailDetails, async (err,data)=>{
            if(err) {
              console.error(err);
              return next(createError(500, "Somthing went wrong when sending mail"))
            }else{
              await newToken.save();
              return next(createSuccess(200 ,"Sent mail successfully"))
            }
        })
}
