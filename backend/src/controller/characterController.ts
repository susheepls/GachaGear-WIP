import { Request ,Response, NextFunction } from "express";
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";
import characterModel from "../model/characters.model";
import { addGearToCharacterReq, CharacterCreate, DeleteCharacterReq, FindCharacterReq, removeGearFromCharacterReq, RenameCharacterReq } from "../interfaces/characterType";

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
    },
    getOneCharacter: async(req: AuthenticatedRequest, res: Response,next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const characterId = Number(req.params.id);

            const getOneCharacterReq = await characterModel.getOneCharacter(accountId, characterId);

            res.status(200).json({ message: 'Character Found', result: getOneCharacterReq });

        } catch(error) {
            next(error);
        }
    },
    createNewCharacter: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const characterName = (req.body as CharacterCreate).characterName;

            const createNewCharacterReq = await characterModel.createNewCharacter(accountId, characterName);
            res.status(200).json({ message: 'New Character Created', result: createNewCharacterReq });
        } catch(error) {
            next(error);
        }
    },
    addGearToCharacter: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(403).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const itemToAdd = (req.body as addGearToCharacterReq).itemId;
            const targetCharacter = (req.body as addGearToCharacterReq).characterId;
            const swapItemId = (req.body as addGearToCharacterReq).swapItemId;

            //if theres a mismatch in character id
            if(req.params.id !== String(targetCharacter)) return res.status(404).json({ message: 'Unauthorized' });

            const addGearToCharacterReq = await characterModel.addGearToCharacter(accountId, targetCharacter, itemToAdd, swapItemId);
            res.status(200).json({ message: 'Success', result: addGearToCharacterReq });
        
        } catch(error) {
            next(error);
        }
    },
    removeGearFromCharacter: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const itemToRemove = (req.body as removeGearFromCharacterReq).itemId;
            const targetCharacter = (req.body as removeGearFromCharacterReq).characterId;

            //if theres a mismatch in character id
            if(req.params.id !== String(targetCharacter)) return res.status(404).json({ message: 'Unauthorized' });

            const removeGearFromCharacterReq = await characterModel.removeGearFromCharacter(accountId, targetCharacter, itemToRemove);

            res.status(200).json({ message: 'Success', result: removeGearFromCharacterReq });

        } catch(error) {
            next(error);
        }
    },
    updateCharacterName: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const newCharacterName = (req.body as RenameCharacterReq).characterName;
            const targetCharacter = (req.body as RenameCharacterReq).characterId;

            if(newCharacterName.length < 3) return res.status(403).json({ message: 'Character Name Too Short' });

            //if theres a mismatch in character id
            if(req.params.id !== String(targetCharacter)) return res.status(404).json({ message: 'Unauthorized' });

            const renameCharacterReq = await characterModel.renameCharacter(accountId, targetCharacter, newCharacterName);

            res.status(200).json({ message: 'Success', result: renameCharacterReq });

        } catch(error) {
            next(error);
        }
    },
    deleteCharacter: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });
            
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const deleteCharacterId = (req.body as DeleteCharacterReq).characterId;

            //if theres a mismatch in character id
            if(req.params.id !== String(deleteCharacterId)) return res.status(404).json({ message: 'Unauthorized' });

            const deleteCharacterReq = await characterModel.deleteCharacter(accountId, deleteCharacterId);

            res.status(200).json({ message: 'Character Deletion Success', result: deleteCharacterReq });


        } catch(error) {
            next(error);
        }
    },
    getAllTotalStatsRanking: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const rankings = await characterModel.getAllTotalStatsRanking();

            res.status(200).json({ result: rankings });

        } catch(error) {
            next(error);
        }
    },
    getSpecificRankingTotalStats: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const targetCharacterId = Number(req.params.characterid);
            const targetCharacterRankingTotalSubstats = await characterModel.getSpecificRankingTotalStats(targetCharacterId);
            
            if(targetCharacterRankingTotalSubstats === null || targetCharacterRankingTotalSubstats === -1) res.status(404).json({ message: "Character Not Found" });

            res.status(200).json({ result: targetCharacterRankingTotalSubstats });

        } catch(error) {
            next(error);
        }
    },
    searchCharacterByName: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const searchedName = req.params.charactername;

            const searchedCharacterNameResults = await characterModel.searchCharacterByName(searchedName);

            if(searchedCharacterNameResults.length < 1) return res.status(404).json({ message: 'Character Not Found' });

            return res.status(200).json({ result: searchedCharacterNameResults });

        } catch(error) {
            next(error);
        }
    },
    searchedCharacterDetails: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const targetCharacterId = Number(req.params.characterid);
            const searchedCharacterDetails = await characterModel.searchedCharacterDetails(targetCharacterId);

            if(!searchedCharacterDetails) res.status(404).json({ message: 'Character Not Found' });

            res.status(200).json({ result: searchedCharacterDetails });

        } catch(error) {
            next(error);
        }
    },
    searchCharacterWithItem: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const characterId = Number(req.params.characterid);

            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const itemOwner = await characterModel.searchCharacterWithItem(accountId, characterId);

            if(!itemOwner) res.status(404).json({ message: 'Character Not Found '});

            res.status(200).json({ result: itemOwner });

        } catch(error) {
            next(error);
        }
    },
    getAllStatsRankings: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const substatType = req.params.substattype;

            const rankings = await characterModel.getAllStatsRanking(substatType);

            res.status(200).json({ result: rankings });

        } catch(error) {
            next(error);
        }
    },
    getSpecificCharacterRankingDesiredSubstats: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const targetCharacterId = Number(req.params.characterid);
            const targetSubstat = req.params.substattype
            
            const targetCharacterRankingTotalSubstats = await characterModel.getSpecificCharacterRankingDesiredSubstats(targetCharacterId, targetSubstat);
            
            if(targetCharacterRankingTotalSubstats === null || targetCharacterRankingTotalSubstats === -1) res.status(404).json({ message: "Character Not Found" });

            res.status(200).json({ result: targetCharacterRankingTotalSubstats });

        } catch(error) {
            next(error);
        }
    }
}

export default characterController;