import { Request, Response } from "express";

import accountModel from '../model/account.model';

const accountController = {
    getAllAccounts: async(req: Request, res: Response) => {
        try {
            const result = await accountModel.getAllAccounts();
            res.status(200);
            res.json(result);
        }catch {
            res.status(500);
        }
    }
}

export default accountController;