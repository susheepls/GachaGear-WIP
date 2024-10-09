import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import InventoryModel from "../model/inventory.model";

const inventoryController = {
    getItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as CustomJwtPayload).id;
            const newItemRolled = await InventoryModel.createItem(userId);
            res.status(200).json(newItemRolled);
        }catch(err) {
            next(err);
        }
    }
}

export default inventoryController