export interface CharacterCreate {
    characterName: string
}

export interface addGearToCharacterReq {
    characterId: number,
    itemId: number,
    swapItemId: number,
}

export interface removeGearFromCharacterReq {
    characterId: number,
    itemId: number,
}

export interface RenameCharacterReq {
    characterId: number,
    characterName: string
}