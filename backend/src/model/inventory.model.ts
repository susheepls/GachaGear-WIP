import { PrismaClient } from "@prisma/client";
import Chooser from "random-seed-weighted-chooser";

const prisma = new PrismaClient();

interface SubstatWeight{ value: number, weight: number};

//atk substat weighted chooser
const returnWeightedATKSubStatValues = () => {
    // 20% 1-100 60% 101-300 20% 301-400
    const weightedATKSubStatValues = [
        { value: Math.floor(Math.random() * 100) + 1, weight: 20 },
        { value: Math.floor(Math.random() * 200) + 101, weight: 60 },
        { value: Math.floor(Math.random()* 100) + 301, weight: 20}
    ];
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedATKSubStatValues) as SubstatWeight;
    return chosenObjectValue.value;
};

//def substat weighted chooser
const returnWeightedDEFSubStatValues = () => {
    // 20% 1-10 60% 11-20 20% 21-30
    const weightedDEFSubStatValues = [
        { value: Math.floor(Math.random() * 10) + 1, weight: 20 },
        { value: Math.floor(Math.random() * 10) + 11, weight: 60 },
        { value: Math.floor(Math.random()* 10) + 21, weight: 20}
    ];
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedDEFSubStatValues) as SubstatWeight;
    return chosenObjectValue.value;
};

//hp substat weighted chooser
const returnWeightedHPSubStatValues = () => {
    // 20% 1-20 60% 21-40 20% 41-50
    const weightedHPSubStatValues = [
        { value: Math.floor(Math.random() * 20) + 1, weight: 20 },
        { value: Math.floor(Math.random() * 20) + 21, weight: 60 },
        { value: Math.floor(Math.random()* 10) + 41, weight: 20}
    ];
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedHPSubStatValues) as SubstatWeight;
    return chosenObjectValue.value;
};

const InventoryModel = {
    createItem: async(accountId: number) => {

        //create the item that will hold the substats
        const createItemTableEntry = await prisma.inventory.create({
            data: {
                ownerId: accountId,
                itemNameId: Math.floor(Math.random() * 3) + 1,
            }
        });

        //make the three substats       
        const itemSubstat1 = await prisma.itemSubstats.create({
            data: {
                value: returnWeightedATKSubStatValues(),
                substatTypeId: 1,
                item_id: createItemTableEntry.id
            }
        });
        const itemSubstat2 = await prisma.itemSubstats.create({
            data: {
                value: returnWeightedDEFSubStatValues(),
                substatTypeId: 2,
                item_id: createItemTableEntry.id,
            }
        });
        const itemSubstat3 = await prisma.itemSubstats.create({
            data: {
                value: returnWeightedHPSubStatValues(),
                substatTypeId: 3,
                item_id: createItemTableEntry.id,
            }
        });
        
        //now update the item to set the substats array to the three that were made
        const addSubstatsToItem = await prisma.inventory.update({
            where: {
                id: createItemTableEntry.id
            },
            data: {
                substats: {
                    set: [itemSubstat1, itemSubstat2, itemSubstat3]
                }
            }
        })

        return await prisma.inventory.findFirst({
            where: {
                id: createItemTableEntry.id
            },
            select: {
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
        });

    },

     //delete item from accountInventory
     deleteFromInventory: async(itemId: number) => {
        return await prisma.inventory.delete({
            where: {
                id: itemId,
            },
            select: {
                id: true,
                name: {
                    select: {
                        name: true
                    }
                },
            }
        })
    },
    getItemFromType: async(accountId: number, itemType: string) => {
        return await prisma.inventory.findMany({
            where: {
                ownerId: accountId,
                name: {
                    name: itemType
                }
            },
            select: {
                id: true,
                exp: true,
                name: {
                    select: {
                        name:true,
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
                },
                characterId: true,
            }
        })
    }
} 

export default InventoryModel;