import { ItemSubstats, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
                value: (Math.random() * 100) + 1,
                substatTypeId: 1,
                item_id: createItemTableEntry.id
            }
        });
        const itemSubstat2 = await prisma.itemSubstats.create({
            data: {
                value: (Math.random() * 100) + 1,
                substatTypeId: 2,
                item_id: createItemTableEntry.id,
            }
        });
        const itemSubstat3 = await prisma.itemSubstats.create({
            data: {
                value: (Math.random() * 100) + 1,
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

        return addSubstatsToItem;

    }
} 

export default InventoryModel;