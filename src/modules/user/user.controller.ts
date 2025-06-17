import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { createUser, findUserByEmail, findUserByUsername, updateUserVerification, updateVerificationCode, findUserById } from './user.crud';
import { sendVerificationEmail } from '../../services/email.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        // Check if user already exists and is verified
        const existingEmail = await findUserByEmail(email);
        if (existingEmail && existingEmail.isVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered and verified'
            });
        }

        // If email exists but not verified, we'll update it
        if (existingEmail && !existingEmail.isVerified) {
            // Generate new verification code
            const verificationCode = generateVerificationCode();
            const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            // Update user with new verification code
            await updateVerificationCode(email, verificationCode, verificationCodeExpires);

            // Send new verification email
            const emailSent = await sendVerificationEmail(email, verificationCode);

            // Generate token
            const token = jwt.sign(
                { id: existingEmail._id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                message: emailSent 
                    ? 'New verification code sent. Please check your email.'
                    : 'New verification code generated. Please contact support for email verification.',
                token,
                verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
            });
        }

        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                error: 'Username already taken'
            });
        }

        // Generate verification code for new user
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create new user
        const user = await createUser({
            email,
            password,
            username,
            verificationCode,
            verificationCodeExpires
        });

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: emailSent 
                ? 'Registration successful. Please check your email for verification code.'
                : 'Registration successful. Please contact support for email verification.',
            token,
            verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email already verified'
            });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                error: 'Invalid verification code'
            });
        }

        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Verification code expired'
            });
        }

        // Update user verification status
        await updateUserVerification(email, true);

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                error: 'Please verify your email before logging in'
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};