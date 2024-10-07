import { Inventory, PrismaClient } from "@prisma/client";
import { AccountCreateType } from "../interfaces/accountType";

const prisma = new PrismaClient();

const accountModel = {
    getAllAccounts: async() => {
        return await prisma.account.findMany();
    },
    getOneAccount: async(number: number) => {
        return await prisma.account.findFirst({
            where: {
                id: number
            }
        })
    },
    getOneAccountByUsername: async(username: string) => {
        return await prisma.account.findFirst({
            where: {
                username: username
            }
        })
    },
    createAccount: async(username: string, password: string) => {
        return await prisma.account.create({
            data: {
                username: username,
                password: password,
            }
        })
    },
    changeAccountPassword: async(accountId: string, newPassword: string) => {
        return await prisma.account.update({
            where: {
                id: Number(accountId)
            },
            data: {
                password: newPassword
            }
        })
    },
    accountLogin: async(username: string) => {
        return await prisma.account.findFirst({
            where: {
                username: username,
            }
        })
    },
    getAccountInventory: async(accountId: number) => {
        return await prisma.inventory.findMany({
            where: {
                ownerId: accountId
            },
        })
    },

    //new inventory return to get details instead of just id
    getAccountInventoryName: async(accountId: number) => {
        return await prisma.inventory.findMany({
            select: {
                level: true,
                name: {
                    select: {
                        name: true
                    }
                },
                substats: {
                    select: {
                        value: true,
                        substatType: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                ownerId: accountId
            }
        })
        
    }
}

export default accountModel;