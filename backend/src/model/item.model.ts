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
    enhanceItem: async(itemId:number, currencyInput: number) => {
        return await prisma.inventory.update({
            where: {
                id: itemId
            },
            data: {
                exp: {
                    increment: currencyInput
                }
            }
        })
    },
}

export default itemModel;