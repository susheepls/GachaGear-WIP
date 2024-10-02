import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next();
    })
}