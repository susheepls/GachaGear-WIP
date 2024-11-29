

export interface allTotalSubstatsRankingsData {
    result: CharacterDataForRankings[]
}

export interface CharacterDataForRankings {
    id: number,
    characterName: string,
    ownerId: number,
    equipment: RankItem[],
    substatsTotal: number
}

export interface RankItem {
    name: { name: string },
    substats: RankSubstats[]
}
export interface RankSubstats {
    substatType: { name: string },
    value: number
}