import 'dotenv/config'
import jwt from 'jsonwebtoken'

export function generateJWT(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1hr' })
}