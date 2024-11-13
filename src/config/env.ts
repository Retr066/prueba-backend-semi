import { config } from 'dotenv'

config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export const PORT = process.env.PORT || 3000;


