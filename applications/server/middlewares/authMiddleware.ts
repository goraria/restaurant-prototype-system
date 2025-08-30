import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";

dotenv.config()

export const verifyToken: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // const verified = jwt.verify(token, process.env.JWT_SECRET!);
        // req.user = verified;
        // @ts-ignore
        req.user = jwt.verify(token, process.env.JWT_SECRET!);

        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Alias for compatibility with chat service
export const authenticateToken = verifyToken;

// Function to verify token and return user data (for Socket.IO)
export const verifyTokenAndGetUser = async (token: string): Promise<any> => {
    try {
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        return verified;
    } catch (err: any) {
        throw new Error('Invalid token');
    }
};
