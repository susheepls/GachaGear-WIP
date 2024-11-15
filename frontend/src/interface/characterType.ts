import { Item } from "./inventoryType"

export interface AccountCharacters {
    message: string,
    result: CharacterData[]
}

export interface OneCharacter {
    message: string,
    result: Character
}

export interface CharacterData {
    characters: Character[]
}

export interface Character {
    id: number,
    characterName: string,
    equipment: Item[]
}

export interface AddGearToCharacterReq {
    characterId: number,
    itemId: number,
    swapItemId: number | null,
}

export interface RemoveGearFromCharacterReq {
    characterId: number,
    itemId: number,
}

export interface CreateCharacterReq {
    characterName: string,
}