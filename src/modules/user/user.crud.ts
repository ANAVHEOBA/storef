import bcrypt from 'bcryptjs';
import { User } from './user.schema';
import { IUser, ICreateUserDTO } from './user.model';

export const createUser = async (userData: ICreateUserDTO): Promise<IUser> => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user with hashed password
    const user = new User({
        ...userData,
        password: hashedPassword
    });

    return user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
};

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
    return User.findOne({ username });
};

export const updateUserVerification = async (email: string, isVerified: boolean): Promise<IUser | null> => {
    return User.findOneAndUpdate(
        { email },
        { 
            isVerified,
            verificationCode: undefined,
            verificationCodeExpires: undefined
        },
        { new: true }
    );
};

export const updateVerificationCode = async (
    email: string,
    verificationCode: string,
    verificationCodeExpires: Date
): Promise<IUser | null> => {
    return User.findOneAndUpdate(
        { email },
        { verificationCode, verificationCodeExpires },
        { new: true }
    );
};

export const findUserById = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId).select('-password -verificationCode -verificationCodeExpires');
};
