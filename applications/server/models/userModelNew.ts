import mongoose, { Schema, Document } from 'mongoose';

// Interface đại diện cho một document User (bao gồm các thuộc tính của Mongoose)
export interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
}

// Schema tương ứng với Interface IUser
const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Tạo và export Model
// Tham số thứ 3 là tên collection trong MongoDB (thường là số nhiều của tên Model)
// Mongoose tự động chuyển 'User' thành 'users' nếu không cung cấp
export default mongoose.model<IUser>('User', UserSchema);