import { Request, Response, NextFunction } from "express";

import accountModel from '../model/account.model';
import { AccountChangePasswordType, AccountCreateType, DecreaseAmount, IncreaseAmount, Items } from "../interfaces/accountType";
import bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest, CustomJwtPayload } from "../interfaces/jwtTypes";

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
    getOneAccount: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountNumber = (req.user as CustomJwtPayload).id;
            const result = await accountModel.getOneAccount(accountNumber);
            if(!result) {
                return res.status(404).json({ message: 'account not found'});
            }
            res.status(200).json({username: result.username, userId: result.id});
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
            const { username, password } = req.body;
            const getAccount = await accountModel.accountLogin(username);

            if(!getAccount) return res.status(401).json({message: 'invalid credentials'});

            //check if password matches hashed password
            const isPasswordMatch = await bcrypt.compare(password, getAccount.password);
            if(!isPasswordMatch) return res.status(401).json({message: 'invalid credentials'});

            //create JWT payload
            const user = { username: getAccount.username, id: getAccount.id};

            //generate JWT token with expiration time (1hr)
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
                expiresIn: '1h',
                algorithm: 'HS256'
            })
            
            return res.status(200).json({
                message: "login success",
                accessToken: accessToken
            });
        }catch (error){
            next(error);
        }
    },
    getAccountInventory: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({message: "invalid credentials"});
            const accountId = (req.user as CustomJwtPayload).id;
            if(!accountId) return res.status(403).send({message: "user not authenticated"});

            const accountInventory = await accountModel.getAccountInventoryName(accountId);
            return res.status(200).send({message: "user inventory found", accountInventory});

        } catch(error){
            next(error);
        }
    },
    getAccountCurrency: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = Number((req.user as CustomJwtPayload).id);
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const accountCurrency = await accountModel.getAccountCurrency(accountId);
            return res.status(200).json(accountCurrency);

        } catch(error) {
            next(error);
        }
    },
    decreaseAccountCurrency: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = Number((req.user as CustomJwtPayload).id);
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const getAccountCurrency = await accountModel.getAccountCurrency(accountId);
            const decreaseAmount = req.body as DecreaseAmount;

            if(getAccountCurrency && getAccountCurrency.currency > decreaseAmount.decreaseAmount) {
                const accountCurrencyDecrease = await accountModel.decreaseAccountCurrency(accountId, decreaseAmount.decreaseAmount);
                return res.status(200).json({ message: 'Currency Decreased', result: accountCurrencyDecrease });
            } else {
                return res.status(406).json({ message: 'Not Enough Currency' }); 
            }

        } catch(error) {
            next(error);
        }
    },
    increaseAccountCurrency: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const accountUsername = (req.user as CustomJwtPayload).username;
            if(accountUsername !== req.params.username) return res.status(404).json({ message: 'Unauthorized' });

            const accountId = Number((req.user as CustomJwtPayload).id);
            if(!accountId) return res.status(404).json({ message: 'Account Id Not Found' });

            const increaseAmount = req.body as IncreaseAmount;
            const accountCurrencyIncrease = await accountModel.increaseAccountCurrency(accountId, increaseAmount.increaseAmount);

            return res.status(200).json({ message: 'Currency Increased', result: accountCurrencyIncrease });

        } catch(error) {
            next(error);
        }
    }
}

export default accountController;