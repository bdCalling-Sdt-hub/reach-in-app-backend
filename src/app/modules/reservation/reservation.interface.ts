import { Types } from "mongoose"

export type IReservation = {
    user: Types.ObjectId,
    salon: Types.ObjectId, // set name of the provider,
    price: Number,
     
}