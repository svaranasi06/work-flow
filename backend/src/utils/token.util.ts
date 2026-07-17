import jwt, { SignOptions } from "jsonwebtoken";

export interface TokenPayload {
  id: number;
  emp_id: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET as string;

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;

  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET as string;

  return jwt.verify(token, secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET as string;

  return jwt.verify(token, secret) as TokenPayload;
};

export const getRefreshTokenExpiryDate = (): Date => {
  const expiryDate = new Date();

  expiryDate.setDate(expiryDate.getDate() + 7);

  return expiryDate;
};