import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export interface CustomJwtPayload extends JwtPayload{
    id: number,
    username: string,
}
