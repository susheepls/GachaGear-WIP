import { Request, Response, NextFunction } from "express";

import itemModel from "../model/item.model";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import { error } from "console";

const itemController = {
    getOneItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            
            //if the username is not equal to the url inputted
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'User Not Authorized'});
            
            const itemNumber = Number(req.params.id);
            const result = await itemModel.getOneItem(itemNumber);

            //if invalid item
            if(!result) return res.status(404).json({ message: 'Item Not Found'});

            return res.status(200).send({message: 'item found', result});

        } catch(error) {
            next(error);
        }
    }
}

export default itemController;