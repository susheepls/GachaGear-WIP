export interface Currency {
    currency: number
}
export interface CurrencyDecreaseResponse {
    message: string,
    result: {
        currency: number
    }
}
export interface CurrencyDecreaseRequest {
    decreaseAmount: number
}

export interface CurrencyIncreaseResponse {
    message: string,
    result: {
        currency: number
    }
}
export interface CurrencyIncreaseRequest {
    increaseAmount: number
}