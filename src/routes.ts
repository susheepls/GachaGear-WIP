import { Router } from "express";

const router = Router();

//imports
import accountController from './controller/accountController';

//set up routes
router.get('/accounts', accountController.getAllAccounts);

export default router;