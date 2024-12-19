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

export interface FetchSkinReq {
    message: string,
    result: FetchedSkinData[] | null
}

export interface FetchedSkinData {
    id: number,
    name: string,
    rarity: {
        id: number,
        name: string,
    },
    itemName: {
        id: number,
        name: string
    }
}