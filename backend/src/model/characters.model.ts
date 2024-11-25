import { Character, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const itemOrder = ['hat', 'armor', 'sword'];
const substatOrder = ['hp', 'def', 'atk'];

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
                characterName: name,
                processedName: name.toLowerCase().split(" ").join(""),
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
    deleteCharacter: async(accountId: number, characterId: number) => {
        const character = await prisma.character.findFirst({
            where: {
                id: characterId,
                ownerId: accountId,
            }
        });

        if(!character) return;
        const unequipGearFromCharacter = await prisma.inventory.updateMany({
            where: {
                characterId: character.id
            },
            data: {
                characterId: null,
            }
        });

        return await prisma.character.delete({
            where: {
                id: characterId,
                ownerId: accountId,
            }
        });
    },
    getAllTotalStatsRanking: async() => {
        const allCharactersRank = await prisma.character.findMany({
            include: {
                equipment: {
                    select: {
                        name: {
                            select: {
                                name: true
                            }
                        },
                        substats: {
                            select: {
                                substatType: {
                                    select: {
                                        name: true,
                                    }
                                },
                                value: true,
                            }
                        }
                    }
                }
            }
        });

        const allCharactersRankWithTotals = allCharactersRank.map(character => {

            const substatsTotal = character.equipment.reduce((equipmentSum, equipment) => {

                const substatsSum = equipment.substats.reduce(
                    (substatSum, substat) => substatSum + substat.value, 0
                );

                return equipmentSum + substatsSum
            }, 0);

            return {...character, substatsTotal };
        })
        .filter(character => character.substatsTotal > 0)
        .sort((a, b) => b.substatsTotal - a.substatsTotal );

        return allCharactersRankWithTotals.slice(0, 11);
    },
    getSpecificRankingTotalStats: async(characterId: number) => {
        const allCharactersRank = await prisma.character.findMany({
            include: {
                equipment: {
                    select: {
                        name: {
                            select: {
                                name: true
                            }
                        },
                        substats: {
                            select: {
                                substatType: {
                                    select: {
                                        name: true,
                                    }
                                },
                                value: true,
                            }
                        }
                    }
                }
            }
        });
        const allCharactersRankWithTotals = allCharactersRank.map(character => {

            const substatsTotal = character.equipment.reduce((equipmentSum, equipment) => {

                const substatsSum = equipment.substats.reduce(
                    (substatSum, substat) => substatSum + substat.value, 0
                );

                return equipmentSum + substatsSum
            }, 0);

            return {...character, substatsTotal };
        })
        .filter(character => character.substatsTotal > 0)
        .sort((a, b) => b.substatsTotal - a.substatsTotal );
        
        const rankingOfCharacter = allCharactersRankWithTotals.findIndex(character => character.id === characterId);
        
        return rankingOfCharacter;

    },
    searchCharacterByName: async(searchCharacterName: string) => {
        const searchedName = searchCharacterName.toLowerCase().split(" ").join("");
        const charactersWithName = await prisma.character.findMany({
            where: {
                processedName: searchedName,
            },
            select: {
                id: true,
                characterName: true,
            }
        });

        return charactersWithName;
    },
    searchedCharacterDetails: async(characterId: number) => {
        const character = await prisma.character.findFirst({
            where: {
                id: characterId,
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
                                substatType: {
                                    select: {
                                        name: true,
                                    }
                                },
                                value: true,
                            }
                        }
                    }
                }
            }
        });

        if(!character) return;
        if(character.equipment) {
            character.equipment.sort((a, b) => itemOrder.indexOf(a.name!.name) - itemOrder.indexOf(b.name!.name));
        }
        character.equipment.forEach((item) => item.substats.sort((a, b) => substatOrder.indexOf(a.substatType!.name) - substatOrder.indexOf(b.substatType!.name)));

        return character;
    }


}

export default characterModel;