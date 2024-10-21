import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const itemModel = {
    getOneItem: async(itemId: number) => {
        return await prisma.inventory.findFirst({
            where: {
                id: itemId
            }
        })
    },
}

export default itemModel;