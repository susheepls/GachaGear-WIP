export interface EnhanceItemExp {
    expIncrease: number
}
export interface ItemSubstatIncrease {
    message: string,
    result: {
        value: string,
        substatType: SubstatType
        increaseValue: number,
    }
}
export interface SubstatType {
    name: string
}