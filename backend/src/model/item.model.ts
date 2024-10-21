import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const itemModel = {
    getOneItem: async(itemId: number) => {
        return await prisma.inventory.findFirst({
            where: {
                id: itemId
            },
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
            }
        })
    },
}

export default itemModel;