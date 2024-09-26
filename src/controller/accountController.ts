import { Request, Response, NextFunction } from "express";

import accountModel from '../model/account.model';

const accountController = {
    getAllAccounts: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await accountModel.getAllAccounts();
            res.status(200);
            res.json(result);
        }catch(error) {
            next(error);
        }
    },
    getOneAccount: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const accountNumber = Number(req.params.id);
            const result = await accountModel.getOneAccount(accountNumber);
            res.status(200);
            res.json(result);
        }catch(error) {
            next(error);
        }
    },
    getOneAccountByUsername: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const username = req.params.username;
            const result = await accountModel.getOneAccountByUsername(username);
            res.status(200);
            res.json(result);
        }catch(error) {
            next(error);
        }
    }
}

export default accountController;