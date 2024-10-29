export interface lastAccountBoxOpenTime {
    message : string,
    result : {
        last_box_open: Date | null
    }
}

export interface lastAccountBoxOpenTimeSuccess {
    message : string,
    result : Date
}