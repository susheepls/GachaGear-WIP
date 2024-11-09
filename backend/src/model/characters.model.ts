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
    getOneCharacter: async(accountId: number, characterId: number) => {
        return await prisma.character.findFirst({
            where: {
                id: characterId,
                ownerId: accountId
            },
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
                                        name: true
                                    }
                                }
                            }
                        },
                        characterId: true,
                    }
                }
            }
        })
    },
    createNewCharacter: async(accountId: number, name: string) => {
        return await prisma.character.create({
            data: {
                ownerId: accountId,
                characterName: name
            },
        })
    },
    addGearToCharacter: async(accountId: number, characterId: number, equipmentId: number, swapOutItemId: number | null) => {
        if(swapOutItemId !== null) {
            const swapOutItem = await prisma.inventory.update({
                where: {
                    ownerId: accountId,
                    id: swapOutItemId
                }, 
                data: {
                    characterId: null
                }
            });
            if(!swapOutItem) throw new Error('SwapOut Item Not Found');
            await prisma.inventory.update({
                where:{
                    ownerId: accountId,
                    id: swapOutItem.id
                },
                data: {
                    characterId: null
                }
            })
        };
        const equipItemExists = await prisma.inventory.findUnique({
            where:{
                ownerId: accountId,
                id: equipmentId
            },
        });
        if(!equipItemExists) throw new Error('Item Not Found');
        const equipItem = await prisma.inventory.update({
            where: {
                id: equipItemExists.id,
                ownerId: accountId
            },
            data: {
                characterId: characterId
            }
        })
        return equipItem;
    },
    removeGearFromCharacter: async(accountId: number, characterId: number, equipmentId: number) => {
        const unequipItem =  await prisma.inventory.findFirst({
            where: {
                ownerId: accountId,
                id: equipmentId,
                characterId: characterId,
            }
        });

        if(!unequipItem){
            throw new Error("Equipment not found for given account and character.")
        };

        const unequipReq = await prisma.inventory.update({
            where: {
                id: equipmentId
            },
            data: {
                characterId: null,
            }
        });
        return unequipReq;

    },
    renameCharacter: async(accountId: number, characterId: number, newCharacterName: string) => {
        return await prisma.character.update({
            where: {
                id: characterId,
                ownerId: accountId,
            },
            data: {
                characterName: newCharacterName
            }
        })
    },

}

export default characterModel;