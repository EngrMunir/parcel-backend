import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
const generateToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: string
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn  as StringValue,
    algorithm: "HS256", // although it's the default, we can specify
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
