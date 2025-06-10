import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateUserDTO {
    email: string;
    username: string;
    password: string;
    verificationCode: string;
    verificationCodeExpires: Date;
}

