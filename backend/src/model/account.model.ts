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

    //get account box last opended date
    getLastFreeCurrencyBox: async(accountId: number) => {
        return await prisma.account.findFirst({
            where: {
                id: accountId
            },
            select: {
                last_box_open: true
            }
        })
    },
    
    //update account last opened date
    updateLastFreeCurrencyBox: async(accountId: number, date: Date) => {
        const upsertAccountLastOpenTime = await prisma.account.update({
            where: {
                id: accountId
            },
            data: {
                last_box_open: date
            }
        });
        return upsertAccountLastOpenTime.last_box_open;
    },
    totalRankingsofMostCurrency: async() => {
        const allAccountCurrencies = await prisma.account.findMany({
            select: {
                username: true,
                currency: true,
            }
        });

        const qualifyingAccounts = allAccountCurrencies.filter((account) => account.currency > 1000);
        qualifyingAccounts.sort((a, b) => b.currency - a.currency);

        return qualifyingAccounts.slice(0, 10);
    },
    individualCurrencyRanking: async(accountId: number) => {
        const allAccountCurrencies = await prisma.account.findMany({
            select: {
                id: true,
                username: true,
                currency: true,
            }
        });

        const sortedCurrencyRankingsOfAllAccounts = allAccountCurrencies.sort((a, b) => b.currency - a.currency);
        const accountRanking = sortedCurrencyRankingsOfAllAccounts.findIndex(account => account.id === accountId);
        return accountRanking;
    }
}

export default accountModel;