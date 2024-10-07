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