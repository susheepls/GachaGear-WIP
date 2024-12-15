import { PrismaClient } from "@prisma/client";
import Chooser from "random-seed-weighted-chooser";

const prisma = new PrismaClient();

const skinRates = [
    { value: 1, weight: 60 }, //common
    { value: 2, weight: 30 }, //rare
    { value: 3, weight: 9.5 }, //epic
    { value: 4, weight: 0.5 } //legendary
]

interface SkinRates {
    value: number,
    weight: number,
}

const returnRarityId = () => {
    const chosenRarity = Chooser.chooseWeightedObject(skinRates) as SkinRates;
    return chosenRarity.value;
}

const skinModel = {
    createOneSkin: async(accountId: number) => {
        const chosenRarityId = returnRarityId();

        const allSkinsOfRarity = await prisma.itemSkin.findMany({
            where: {
                rarityId: chosenRarityId,
                ownerId: null,
            },
            select: {
                name: true,
                itemNameId: true, // Include required foreign key
                rarityId: true,
            }
        });

        const chooseRandomSkinOfThatRarityIndex = Math.floor(Math.random() * allSkinsOfRarity.length);

        const chosenSkin = allSkinsOfRarity[chooseRandomSkinOfThatRarityIndex];

        const createSkinAndAddToAccount = await prisma.itemSkin.create({
            data: {
                name: chosenSkin.name,
                rarityId: chosenRarityId,
                itemNameId: Math.floor(Math.random() * 3) + 1,
                ownerId: accountId,
            },
            select: {
                name: true,
                rarity: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                itemName: {
                    select: {
                        name: true,
                    }
                },
            }
        });

        return createSkinAndAddToAccount;

    }
}

export default skinModel;
