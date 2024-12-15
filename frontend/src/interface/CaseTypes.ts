export interface ChosenCurrencyCasePool {
    value: string[],
    weight: number,
}

export interface OpenSkinCaseReq {
    result: SkinCaseData
}

export interface SkinCaseData {
    name: string,
    rarity: {
        id: number,
        name: string,
    },
    itemName: {
        name: string,
    }
}