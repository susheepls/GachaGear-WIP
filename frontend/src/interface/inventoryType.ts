export interface InventoryType {
    message: string,
    accountInventory: Item[]
}

export interface Item {
    level: number,
    name: ItemNameType,
    substats: Substats[]
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