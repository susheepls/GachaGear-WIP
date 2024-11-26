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

export interface SearchCharacterRes {
    result: SearchedCharacters[]
    message? : string
}

export interface SearchedCharacters {
    id: number,
    characterName: string
}

export interface SearchedCharacterDetailsRes {
    result: SearchedCharacterDetails,
    message?: string,
}

export interface SearchedCharacterDetails {
    id: number,
    characterName: string,
    equipment: SearchedCharacterItem[]
}

export interface SearchedCharacterItem {
    id: number,
    exp: number,
    name: { name: string },
    substats: SearchedSubstatsType[]
}

export interface SearchedSubstatsType {
    substatType: { name: string },
    value: number
}

export interface RankingNumber {
    result: number,
}