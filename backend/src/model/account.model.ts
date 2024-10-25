import { PrismaClient } from "@prisma/client";

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
                id: true,
                exp: true,
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
        
    },

    //get account currency only
    getAccountCurrency: async(accountId: number) => {
        return await prisma.account.findFirst({
            where: {
                id: accountId
            },
            select: {
                currency: true
            }
        })
    },

    //subtract account currency
    decreaseAccountCurrency: async(accountId: number, decreaseAmount: number) => {
        return await prisma.account.update({
            where: {
                id: accountId
            },
            data: {
                currency: {
                    decrement: decreaseAmount
                }
            },
            select: {
                currency: true
            }
        });
    },

    //increase account currency
    increaseAccountCurrency: async(accountId: number, increaseAmount: number) => {
        return await prisma.account.update({
            where: {
                id: accountId
            },
            data: {
                currency: {
                    increment: increaseAmount
                }
            },
            select: {
                currency: true
            }
        })
    },
}

export default accountModel;