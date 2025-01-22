import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
import { GenerateTokenPayload } from '../interfaces';


export const generateToken = (payload: GenerateTokenPayload, expiresIn: string | number = '1d'): string => {
    return jwt.sign(payload, jwtSecret, { expiresIn });
};