import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Rank {
    name: string;
    price: number;
}
export interface Order {
    id: bigint;
    username: string;
    timestamp: bigint;
    itemName: string;
    itemType: ItemType;
    quantity: bigint;
    price: number;
}
export interface Crate {
    name: string;
    unit: string;
    price: number;
}
export enum ItemType {
    rank = "rank",
    crate = "crate"
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    getCrates(): Promise<Array<Crate>>;
    getOrderCount(): Promise<bigint>;
    getOrdersByUsername(username: string): Promise<Array<Order>>;
    getRanks(): Promise<Array<Rank>>;
    submitOrder(username: string, itemName: string, itemTypeText: string, price: number, quantity: bigint): Promise<bigint>;
}
