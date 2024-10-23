import { Request, Response, NextFunction } from "express";

import itemModel from "../model/item.model";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import { error } from "console";
import { EnhanceItemExp } from "../interfaces/itemType";

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
    },
    enhanceItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            
            //if the username is not equal to the url inputted
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'User Not Authorized'});
            
            const itemNumber = Number(req.params.id);
            const expIncrease = (req.body as EnhanceItemExp).expIncrease

            //if increase exp is not greater than 0 or more than 100
            if(expIncrease <= 0) res.status(406).send({ message: 'Exp Must Be Greater Than 0' });
            if(expIncrease > 100) res.status(406).send({ message: 'Exp Must Be Less Than 100' });

            const result = await itemModel.enhanceItem(itemNumber, expIncrease)

            res.status(200).send({ message: 'Enhance Success', result: result});
        } catch(error) {
            next(error);
        }
    }
}

export default itemController;