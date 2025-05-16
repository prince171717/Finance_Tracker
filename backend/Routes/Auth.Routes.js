import express, { Router } from 'express'
import { addTransaction, checkAuth, deleteTransaction, fetchAllTransaction, fetchTransaction, forgotPassword, login, logout, resetPassword, signup, updateTransaction } from '../Controllers/Auth.controller.js';
import { loginValidation, protectedRoute, signUpValidation } from '../Middlewares/Auth.middleware.js';

const router = Router();

router.post('/signup', signUpValidation ,signup);
router.post('/login',loginValidation, login);
router.post('/logout', logout);
router.get('/check-auth',protectedRoute, checkAuth);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.post('/add-transaction',protectedRoute, addTransaction);
router.get('/fetch-transaction',protectedRoute, fetchTransaction);
router.delete('/delete-transaction/:id',protectedRoute, deleteTransaction);
router.put('/update-transaction/:id',protectedRoute, updateTransaction);
router.get('/fetch-all-transaction',protectedRoute, fetchAllTransaction);





export default router