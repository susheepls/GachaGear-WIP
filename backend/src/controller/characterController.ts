import { Request ,Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import characterModel from "../model/characters.model";

const characterController = {
    getAllAccountCharacters: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const getAllAccountCharactersReq = await characterModel.getAccountCharacters(accountId);
            res.status(200).json({ message: 'Characters Found', result: getAllAccountCharactersReq });

        } catch (error) {
            next(error);
        }
    }
}

export default characterController;