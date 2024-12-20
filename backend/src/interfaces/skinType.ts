export interface EquipSwapSkinReq {
    characterId: number,
    equipSwapSkinIds: (number | null)[],
}

export interface BackToDefaultReq {
    characterId: number,
}