import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const atkType = await prisma.substatTypes.upsert({
        where: {
            name: 'atk'
        },
        update: {},
        create: {
            name: 'atk'
        }
    });
    const defenseType = await prisma.substatTypes.upsert({
        where: {
            name: 'def'
        },
        update: {},
        create: {
            name: 'def'
        }
    });
    const hpType = await prisma.substatTypes.upsert({
        where: {
            name: 'hp'
        },
        update: {},
        create: {
            name: 'hp'
        }
    });
    const swordName = await prisma.itemName.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            name: 'sword'
        }
    });
    const hatName = await prisma.itemName.upsert({
        where: {
            id: 2,
        },
        update: {},
        create: {
            id: 2,
            name: 'hat'
        }
    });
    const armorName = await prisma.itemName.upsert({
        where: {
            id: 3,
        },
        update: {},
        create: {
            id: 3,
            name: 'armor'
        }
    });
    //skin rarity
    const commonRarity = await prisma.skinRarity.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            name: 'common'
        }
    });
    const rareRarity = await prisma.skinRarity.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            id: 2,
            name: 'rare'
        }
    });
    const epicRarity = await prisma.skinRarity.upsert({
        where: {
            id: 3
        },
        update: {},
        create: {
            id: 3,
            name: 'epic'
        }
    });
    const legendaryRarity = await prisma.skinRarity.upsert({
        where: {
            id: 4
        },
        update: {},
        create: {
            id: 4,
            name: 'legendary'
        }
    });
    //skins
    const poopSkin1 = await prisma.itemSkin.upsert({
        where: {
            id: 1
        },
        update: {},
        create: {
            id: 1,
            name: 'poop1',
            rarityId: 1
        }
    });
    const poopSkin2 = await prisma.itemSkin.upsert({
        where: {
            id: 2
        },
        update: {},
        create: {
            id: 2,
            name: 'poop2',
            rarityId: 1
        }
    });
    const blueSteelSkin = await prisma.itemSkin.upsert({
        where: {
            id: 3
        },
        update: {},
        create: {
            id: 3,
            name: 'blueSteel0', //0 means no variants
            rarityId: 2
        }
    });
    const galaxySkin1 = await prisma.itemSkin.upsert({
        where: {
            id: 4
        },
        update: {},
        create: {
            id: 4,
            name: 'galaxy1',
            rarityId: 3
        }
    })
    const galaxySkin2 = await prisma.itemSkin.upsert({
        where: {
            id: 5,
        },
        update: {},
        create: {
            id: 5,
            name: 'galaxy2',
            rarityId: 3
        }
    })


}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})