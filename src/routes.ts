import { Router } from "express";

const router = Router();

//imports
import accountController from './controller/accountController';

//set up routes
//accounts
router.get('/accounts', accountController.getAllAccounts);
router.get('/accounts/:id', accountController.getOneAccount);
router.get('/accounts/usernames/:username',accountController.getOneAccountByUsername);
router.post('/accounts', accountController.createAccount);
export default router;