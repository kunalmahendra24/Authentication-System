import  jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authMiddleware = (req, res, next) => {
    const {token} = req.cookies; 
    if(!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id){
            req.body.userId=decoded.id;
        }
        else{
            return res.status(401).json({ message: "Token is not valid" });
        }
        req.user = decoded;
        next();
    }
    

    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
export default authMiddleware;
