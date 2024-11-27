export interface InventoryType {
    message: string,
    accountInventory: Item[]
}

export interface Item {
    id: number,
    exp: number,
    name: ItemNameType,
    substats: Substats[],
    character: { characterName: string },
    characterId: number,
}
export interface ItemNameType {
    name: string,
}
export interface Substats {
    substatType: SubstatType,
    value: number
}
export interface SubstatType {
    name: string,
}

export interface EnhanceOneItemType {
    message: string,
    result: Item | null,
}

export interface GetOneItemTypeReq {
    itemType: string
}

export interface GetOneItemTypeRes {
    message: string,
    result: Item[]
}