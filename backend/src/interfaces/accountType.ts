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