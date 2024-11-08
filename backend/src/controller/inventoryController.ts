import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import InventoryModel from "../model/inventory.model";
import { GetItemByTypeReq } from "../interfaces/itemType";
import itemController from "./itemController";

const inventoryController = {
    getItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as CustomJwtPayload).id;
            const newItemRolled = await InventoryModel.createItem(userId);
            res.status(200).json(newItemRolled);
        }catch(err) {
            next(err);
        }
    },
    deleteItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = Number((req.user as CustomJwtPayload).id);
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const itemId = Number(req.params.itemId);
            const deleteItem = await InventoryModel.deleteFromInventory(itemId);
            
            res.status(200).json({ message: 'Item Sold!', result: deleteItem });
        } catch(error) {
            next(error);
        }
    },
    getItemByType: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = Number((req.user as CustomJwtPayload).id);
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const itemType = req.params.itemtype;

            const accountItemsByType = await InventoryModel.getItemFromType(accountId, itemType);
            res.status(200).json({ message: 'Items that match type', result: accountItemsByType });

        } catch(error) {
            next(error);
        }
    }
}

export default inventoryController