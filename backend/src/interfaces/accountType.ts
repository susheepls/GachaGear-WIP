export interface AccountCreateType {
    username: string,
    password: string,
}
export interface AccountChangePasswordType {
    newPassword: string,
}

export interface Items {
    id: number,
    name: string,
    ownerId: number
}

export interface DecreaseAmount {
    decreaseAmount: number,
}

export interface IncreaseAmount {
    increaseAmount: number,
}