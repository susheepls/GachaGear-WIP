import { Router } from "express";

const router = Router();

//imports
import accountController from './controller/accountController';
import { authenticateToken } from "./middleware/auth";
import inventoryController from "./controller/inventoryController";

//set up routes
//accounts
router.get('/accounts', accountController.getAllAccounts);
router.get('/accounts/:id', accountController.getOneAccount);
router.get('/accounts/usernames/:username',accountController.getOneAccountByUsername);
router.post('/accounts', accountController.createAccount);
router.patch('/accounts/:id/password', accountController.changeAccountPassword);
//login
router.post('/accounts/login', accountController.accountLogin);
//inventory protected routes have middleware as 2nd arg;
router.get('/profile', authenticateToken, accountController.getAccountInventory);

//roll item route (Inventory Routes)
router.post('/profile/gacharoll', authenticateToken, inventoryController.getItem);
export default router;