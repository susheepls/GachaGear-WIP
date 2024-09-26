import { Request, Response, NextFunction } from "express";

import accountModel from '../model/account.model';
import { AccountChangePasswordType } from "../interfaces/accountType";

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
    },
    createAccount: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const createAccountData = req.body;
            await accountModel.createAccount(createAccountData);
            res.status(200).json({message:'Account creation: Success!'});
        }catch(error) {
            next(error);
        }
    },
    changeAccountPassword: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.params.id;
            const newPasswordObj: AccountChangePasswordType = req.body;

            //getting the value of newPasswordObj.newpassword as its own variable and check password
            const { newPassword } = newPasswordObj;
            if (!newPassword || newPassword.length < 8) {
                return res.status(400).json({message: "Invalid password. Must be at least 8 characters."});
            };
            
            //attempt to change password
            const result = await accountModel.changeAccountPassword(accountId, newPassword);
            if(!result) {
                return res.status(400).json({message: 'account not found'});
            }

            res.status(200).json({message: 'password changed success!'})
        }catch(error) {
            next(error);
        }
    }
}

export default accountController;