import jwt, { SignOptions } from 'jsonwebtoken'
import { USER_ROLE } from '../utils/enums'

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN)

export interface JWTPayload {
	id: number
	email: string
	role: USER_ROLE
}

export const generateToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN
      }

	return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string): JWTPayload => {
	return jwt.verify(token, JWT_SECRET) as JWTPayload
}