import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const accountModel = {
    getAllAccounts: async() => {
        return await prisma.account.findMany();
    }
}

export default accountModel;