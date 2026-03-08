import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FlightEnquiry {
    id: bigint;
    destination: string;
    tripType: TripType;
    departureDate: string;
    specialRequests?: string;
    origin: string;
    passengerCount: bigint;
    timestamp: bigint;
    returnDate?: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone?: string;
}
export enum TripType {
    isFlexible = "isFlexible",
    returnTrip = "returnTrip",
    oneWay = "oneWay"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllEnquiries(): Promise<Array<FlightEnquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(origin: string, destination: string, departureDate: string, returnDate: string | null, tripType: TripType, passengerCount: bigint, specialRequests: string | null): Promise<void>;
}
