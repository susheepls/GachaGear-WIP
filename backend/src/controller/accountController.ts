import { Request, Response, NextFunction } from "express";

import accountModel from '../model/account.model';
import { AccountChangePasswordType, AccountCreateType } from "../interfaces/accountType";
import bcrypt from "bcrypt";

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
    createAccount: async(req: Request<{}, {}, AccountCreateType>, res: Response, next: NextFunction) => {
        try {
            //bcrypt is an async function
            // const salt = await bcrypt.genSalt(); //this line is unnecessary cuz the 10 in the next line does the same thing 
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const createAccountUsername = req.body.username;
            await accountModel.createAccount(createAccountUsername, hashedPassword);
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
    },
    accountLogin: async(req: Request<{}, {}, AccountCreateType>, res: Response, next: NextFunction) => {
        try {
            // const username = req.body.username;
            // const password = req.body.password;
            const { username, password } = req.body;
            const getAccount = await accountModel.accountLogin(username);

            if(!getAccount) return res.status(401).json({message: 'invalid credentials'});

            if(await bcrypt.compare(password, getAccount.password)) {
                return res.status(200).json({message: "login success"});
            } else {
                return res.status(401).json({message: "invalid credentials"});
            }
        }catch (error){
            next(error);
        }
    }
}

export default accountController;