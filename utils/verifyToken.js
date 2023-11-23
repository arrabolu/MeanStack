import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookie.access - token;
  if (!token) {
    return next(createError(401, "Not  Authorized"));
  }

  jwt.verify(token, process.env.SECRET_KET, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid Token"));
    } else {
      req.user = user;
    }

    next();
  });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();

        }else{
            return next(createError(403, 'You do not have permission '))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin) {
            next();

        }else{
            return next(createError(403, 'You do not have permission!!!'));
        }
    })
}

