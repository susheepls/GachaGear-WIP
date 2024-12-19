import { Router } from "express";

const router = Router();

//imports
import accountController from './controller/accountController';
import { authenticateToken } from "./middleware/auth";
import inventoryController from "./controller/inventoryController";
import itemController from "./controller/itemController";
import characterController from "./controller/characterController";
import skinController from "./controller/skinController";

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
//get account items by type
router.get('/:username/inventory/types/:itemtype', authenticateToken, inventoryController.getItemByType);

//roll item route (Inventory Routes)
router.post('/gacharoll', authenticateToken, inventoryController.getItem);

//item route
router.get('/:username/inventory/enhance/:id', authenticateToken, itemController.getOneItem);
//enhance item
router.patch('/:username/inventory/enhance/:id', authenticateToken, itemController.enhanceItem);
router.patch('/:username/inventory/enhance/substats/:id', authenticateToken, itemController.increaseSubstatValues);
//deleteitem
router.delete('/:username/inventory/sell/:itemId', authenticateToken, inventoryController.deleteItem);

//currency endpoints
router.get('/:username/currency', authenticateToken, accountController.getAccountCurrency);
//can return message: "Currency Decreased" or "Not Enough Currency"
router.patch('/:username/currency/decrease', authenticateToken, accountController.decreaseAccountCurrency);
router.patch('/:username/currency/increase', authenticateToken, accountController.increaseAccountCurrency);
//update the last box openned time
router.get('/:username/lastbox', authenticateToken, accountController.getLastFreeBoxTime);
router.patch('/:username/lastbox', authenticateToken, accountController.updateLastFreeBoxTime);

//skins endpoint
router.post('/:username/skins', authenticateToken, skinController.createOneSkin);
//equip swap skins on character
router.patch('/:username/skins/characters/:characterid', authenticateToken, skinController.equipSwapSkins);

//character endpoints
router.get('/:username/characters', authenticateToken, characterController.getAllAccountCharacters);
router.get('/:username/characters/:id', authenticateToken, characterController.getOneCharacter);
//create new character
router.post('/:username/characters', authenticateToken, characterController.createNewCharacter);
//rename character
router.patch('/:username/characters/:id', authenticateToken, characterController.updateCharacterName);
//delete character
router.delete('/:username/characters/:id', authenticateToken, characterController.deleteCharacter);
//add gear to character
router.patch('/:username/characters/equip/:id', authenticateToken, characterController.addGearToCharacter);
//remove gear from character
router.patch('/:username/characters/unequip/:id', authenticateToken, characterController.removeGearFromCharacter);
//get item Owner used in SwapEquip Component
router.get('/:username/characters/items/:characterid', authenticateToken, characterController.searchCharacterWithItem);

//ranking routes
//find by character name
router.get('/characters/rankings/search/:charactername', characterController.searchCharacterByName);
//totalsubstats detail when checking rankings
router.get('/characters/rankings/details/:characterid', characterController.searchedCharacterDetails);
//rankings of total substats
router.get('/characters/rankings/totalsubstats', characterController.getAllTotalStatsRanking);
//character ranking SUBSTATS TOTAL
router.get('/characters/rankings/totalsubstats/:characterid', characterController.getSpecificRankingTotalStats);
//user rankings of most currency
router.get('/accounts/rankings/currency', accountController.totalRankingsofMostCurrency);
//individual account ranking of most currency
router.get('/accounts/rankings/currency/:accountid', authenticateToken, accountController.individualCurrencyRanking);
//ranking with desired substats as param
router.get('/characters/rankings/:substattype', characterController.getAllStatsRankings);
//character ranking DESIRED SUBSTAT
router.get('/characters/rankings/:substattype/:characterid', characterController.getSpecificCharacterRankingDesiredSubstats);
export default router;