import { PrismaClient } from "@prisma/client";
import Chooser from "random-seed-weighted-chooser";

const prisma = new PrismaClient();

interface SubstatWeight { value: number, weight: number };

//random substat increase calculators
const weightedAtkSubtatIncreaseValues = () => {
    const weightedAtkIncreaseValues = [
        { value: Math.floor(Math.random()*51) + 50, weight: 20 }, //50-100
        { value: Math.floor(Math.random()*100) + 101, weight: 60 },  //101-200
        { value: Math.floor(Math.random()*100) + 201, weight: 19.5 }, //201-300
        { value: 400, weight: 0.5 }
    ]
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedAtkIncreaseValues) as SubstatWeight;
    return chosenObjectValue.value;
};
const weightedDefSubstatIncreaseValues = () => {
    const weightedDefIncreaseValues = [
        { value: Math.floor(Math.random()*6) + 10, weight: 20 }, //10-15
        { value: Math.floor(Math.random()*5) + 16, weight: 60 }, //16-20
        { value: Math.floor(Math.random()*5) + 21, weight: 19.5 }, //21-25
        { value: 40, weight: 0.5 } //40
    ]
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedDefIncreaseValues) as SubstatWeight;
    return chosenObjectValue.value;
};
const weightedHpSubstatIncreaseValues = () => {
    const weightedHpIncreaseValues = [
        { value: Math.floor(Math.random()*11) + 20, weight: 20 }, //20-30
        { value: Math.floor(Math.random()*10) + 31, weight: 60 }, //31-40
        { value: Math.floor(Math.random()*10) + 41, weight: 19.5 }, //41-50
        { value: 80, weight: 0.5 } //80
    ]
    const chosenObjectValue = Chooser.chooseWeightedObject(weightedHpIncreaseValues) as SubstatWeight;
    return chosenObjectValue.value;
};

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
    increaseSubstat: async(itemId: number) => {
        const substatType = await prisma.itemSubstats.findFirst({
            where: {
                item_id: itemId,
                substatTypeId: Math.floor(Math.random()*3) + 1
            }
        });

        if(substatType?.id === 1){
            const increaseValue = weightedAtkSubtatIncreaseValues();
            const updateRecord = await prisma.itemSubstats.update({
                where: {
                    id: substatType.id
                },
                data: {
                    value: {
                        increment: increaseValue
                    }
                },
                select: {
                    value: true,
                    substatType: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            return { ...updateRecord, increaseValue }
        };
        if(substatType?.id === 2){
            const increaseValue = weightedDefSubstatIncreaseValues()
            const updateRecord = await prisma.itemSubstats.update({
                where: {
                    id: substatType.id
                },
                data: {
                    value: {
                        increment: increaseValue
                    }
                },
                select: {
                    value: true,
                    substatType: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return { ...updateRecord, increaseValue }
        };
        if(substatType?.id === 3){
            const increaseValue = weightedHpSubstatIncreaseValues()
            const updateRecord = await prisma.itemSubstats.update({
                where: {
                    id: substatType.id
                },
                data: {
                    value: {
                        increment: increaseValue
                    }
                },
                select: {
                    value: true,
                    substatType: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return { ...updateRecord, increaseValue }
        };
    }
}

export default itemModel;