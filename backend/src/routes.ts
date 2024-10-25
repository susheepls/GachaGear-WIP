import { Router } from "express";

const router = Router();

//imports
import accountController from './controller/accountController';
import { authenticateToken } from "./middleware/auth";
import inventoryController from "./controller/inventoryController";
import itemController from "./controller/itemController";

//set up routes
//accounts
router.get('/accounts', accountController.getAllAccounts);
router.get('/current-user', authenticateToken, accountController.getOneAccount);
router.get('/accounts/usernames/:username',accountController.getOneAccountByUsername);
router.post('/accounts', accountController.createAccount);
router.patch('/accounts/:id/password', accountController.changeAccountPassword);
//login
router.post('/accounts/login', accountController.accountLogin);
//inventory protected routes have middleware as 2nd arg;
router.get('/:username/inventory', authenticateToken, accountController.getAccountInventory);

//roll item route (Inventory Routes)
router.post('/gacharoll', authenticateToken, inventoryController.getItem);

//item route
router.get('/:username/inventory/enhance/:id', authenticateToken, itemController.getOneItem);
//enhance item
router.patch('/:username/inventory/enhance/:id', authenticateToken, itemController.enhanceItem);
router.patch('/:username/inventory/enhance/substats/:id', authenticateToken, itemController.increaseSubstatValues);

//currency endpoints
router.get('/:username/currency', authenticateToken, accountController.getAccountCurrency);
//can return message: "Currency Decreased" or "Not Enough Currency"
router.patch('/:username/currency/decrease', authenticateToken, accountController.decreaseAccountCurrency);
router.patch('/:username/currency/increase', authenticateToken, accountController.increaseAccountCurrency);
export default router;