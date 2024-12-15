import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import skinModel from "../model/skin.model";

const skinController = {
    createOneSkin: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            
            //if the username is not equal to the url inputted
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'User Not Authorized'});

            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const createAndAddSkin = await skinModel.createOneSkin(accountId);

            res.status(200).json({ result: createAndAddSkin });

        } catch(error) {
            next(error);
        }
    }
}

export default skinController;