export interface InventoryType {
    message: string,
    accountInventory: Item[]
}

export interface Item {
    id: number,
    name: string,
    ownerId: string
}