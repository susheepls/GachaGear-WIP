import { Item } from "./inventoryType"

export interface AccountCharacters {
    message: string,
    result: CharacterData[]
}

export interface CharacterData {
    characters: Character[]
}

export interface Character {
    id: number,
    characterName: string,
    equipment: Item[]
}