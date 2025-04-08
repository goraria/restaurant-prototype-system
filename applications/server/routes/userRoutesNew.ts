import express from 'express';
import { getUsers, createUser } from '@controllers/userControllersNew'; // Sử dụng alias

const router = express.Router();

// Định nghĩa các route cho /api/v1/users
router.route('/')
    .get(getUsers)
    .post(createUser);

// Ví dụ route có tham số: router.route('/:id').get(getUserById)...

export default router;