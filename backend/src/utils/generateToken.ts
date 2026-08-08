import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IUser } from '../types';

const ACCESS_EXPIRY_MS = 15 * 60 * 1000;
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, config.jwt.accessSecret, {
    expiresIn: Math.floor(ACCESS_EXPIRY_MS / 1000),
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: Math.floor(REFRESH_EXPIRY_MS / 1000),
  });
};

export const verifyAccessToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, config.jwt.accessSecret) as { id: string; role: string };
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { id: string };
};

export const generateTokens = (user: IUser) => {
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  
  return {
    accessToken,
    refreshToken,
  };
};
