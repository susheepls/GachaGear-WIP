import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const characterModel = {
    getAccountCharacters: async(accountId: number) => {
        return await prisma.account.findMany({
            where: {
                id: accountId
            },
            select: {
                characters: {
                    select: {
                        id: true,
                        characterName: true,
                        equipment: {
                            select: {
                                id: true,
                                exp: true,
                                name: {
                                    select: {
                                        name: true,
                                    }
                                },
                                substats: {
                                    select: {
                                        value: true,
                                        substatType: {
                                            select: {
                                                name: true,
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

    },

}

export default characterModel;