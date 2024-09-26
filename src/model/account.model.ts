import { PrismaClient } from "@prisma/client";
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
    createAccount: async(usernamePass: AccountCreateType) => {
        return await prisma.account.create({
            data: usernamePass
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
    }
}

export default accountModel;