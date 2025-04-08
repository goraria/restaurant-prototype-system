import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '@models/userModelNew'; // Sử dụng alias

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users: IUser[] = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        // Chuyển lỗi cho middleware xử lý lỗi
        next(error);
        // Hoặc trả về lỗi trực tiếp
        // res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            res.status(400).json({ success: false, error: 'Please provide name and email' });
            return; // Quan trọng: Dừng thực thi nếu thiếu dữ liệu
        }
        const newUser: IUser = await User.create({ name, email });
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        // Xử lý lỗi trùng email (ví dụ)
        if (error instanceof Error && error.message.includes('duplicate key')) {
            res.status(400).json({ success: false, error: 'Email already exists' });
            return;
        }
        next(error); // Chuyển các lỗi khác
    }
};

// Thêm các hàm controller khác (getUserById, updateUser, deleteUser) nếu cần