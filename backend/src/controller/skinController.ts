import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import skinModel from "../model/skin.model";
import { EquipSwapSkinReq } from "../interfaces/skinType";

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
    },
    equipSwapSkins: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            
            //if the username is not equal to the url inputted
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'User Not Authorized'});

            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const equipSwapTargetSkins = (req.body as EquipSwapSkinReq).equipSwapSkinIds;
            const targetCharacterId = (req.body as EquipSwapSkinReq).characterId;

            if(targetCharacterId !== Number(req.params.characterid)) return res.status(403).json({ message: 'Unauthorized' });

            const equipSwapSkinsOnCharacter = await skinModel.equipSwapSkins(accountId, targetCharacterId, equipSwapTargetSkins);

            res.status(200).json({ message: 'Success', result: equipSwapSkinsOnCharacter });

        } catch(error) {
            next(error);
        }
    },
    fetchAccountSkins: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            const accountUsername = (req.user as CustomJwtPayload).username;
            
            //if the username is not equal to the url inputted
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'User Not Authorized'});

            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const fetchAccountSkinsReq = await skinModel.fetchAccountSkins(accountId);

            if(!fetchAccountSkinsReq) res.status(404).json({ message: 'Failure', result: null });
            res.status(200).json({ message: 'Success', result: fetchAccountSkinsReq });

        } catch(error) {
            next(error);
        }
    }
}

export default skinController;