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
    customerName: string;
    status: string;
    destination: string;
    cabinClass?: string;
    tripType: TripType;
    infantsCount: bigint;
    adultsCount: bigint;
    customerPhone: string;
    departureDate: string;
    specialRequests?: string;
    origin: string;
    childrenCount: bigint;
    customerEmail?: string;
    returnDate?: string;
}
export interface FlightEnquiryInput {
    customerName: string;
    destination: string;
    cabinClass?: string;
    tripType: TripType;
    infantsCount: bigint;
    adultsCount: bigint;
    customerPhone: string;
    departureDate: string;
    specialRequests?: string;
    origin: string;
    childrenCount: bigint;
    customerEmail?: string;
    returnDate?: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserBooking {
    customerName: string;
    destination: string;
    cabinClass: string;
    paymentStatus: string;
    bookingId: bigint;
    tripType: string;
    infantsCount: bigint;
    adultsCount: bigint;
    customerPhone: string;
    departureDate: string;
    pnrNumber?: string;
    userId: bigint;
    createdAt: bigint;
    origin: string;
    bookingStatus: string;
    amadeusFlightInfo?: string;
    childrenCount: bigint;
    customerEmail: string;
    returnDate?: string;
}
export interface User {
    id: bigint;
    name: string;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
    phone?: string;
}
export interface VisaEnquiry {
    id: bigint;
    customerName: string;
    status: string;
    country: string;
    customerPhone: string;
    visaType: string;
    travelDate: string;
    passportNumber?: string;
    customerEmail?: string;
    specialNotes?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserBookingInput {
    customerName: string;
    destination: string;
    cabinClass: string;
    tripType: string;
    infantsCount: bigint;
    adultsCount: bigint;
    customerPhone: string;
    departureDate: string;
    origin: string;
    childrenCount: bigint;
    customerEmail: string;
    returnDate?: string;
}
export interface AdminStats {
    totalPNREnquiries: bigint;
    totalTourEnquiries: bigint;
    totalFlightEnquiries: bigint;
    totalBookings: bigint;
    totalVisaEnquiries: bigint;
    totalUsers: bigint;
}
export interface TourEnquiryInput {
    customerName: string;
    adultsCount: bigint;
    customerPhone: string;
    specialRequests?: string;
    travelDate: string;
    tourPackage: string;
    childrenCount: bigint;
    budget?: string;
    customerEmail?: string;
}
export interface VisaEnquiryInput {
    customerName: string;
    country: string;
    customerPhone: string;
    visaType: string;
    travelDate: string;
    passportNumber?: string;
    customerEmail?: string;
    specialNotes?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TourEnquiry {
    id: bigint;
    customerName: string;
    status: string;
    adultsCount: bigint;
    customerPhone: string;
    specialRequests?: string;
    travelDate: string;
    tourPackage: string;
    childrenCount: bigint;
    budget?: string;
    customerEmail?: string;
}
export type SessionToken = string;
export interface PNREnquiry {
    id: bigint;
    customerName: string;
    customerPhone: string;
    pnrNumber: string;
    notes?: string;
    travelDate?: string;
    airline: string;
    customerEmail?: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone?: string;
}
export interface PNREnquiryInput {
    customerName: string;
    customerPhone: string;
    pnrNumber: string;
    notes?: string;
    travelDate?: string;
    airline: string;
    customerEmail?: string;
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
    getAdminStats(token: SessionToken): Promise<AdminStats>;
    getAllBookings(token: SessionToken): Promise<Array<UserBooking>>;
    getAllFlightEnquiries(token: SessionToken): Promise<Array<[bigint, FlightEnquiry]>>;
    getAllPNREnquiries(token: SessionToken): Promise<Array<[bigint, PNREnquiry]>>;
    getAllTourEnquiries(token: SessionToken): Promise<Array<[bigint, TourEnquiry]>>;
    getAllUsers(token: SessionToken): Promise<Array<[bigint, User]>>;
    getAllVisaEnquiries(token: SessionToken): Promise<Array<[bigint, VisaEnquiry]>>;
    getAmadeusFlightInfo(token: SessionToken, pnrNumber: string, airline: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserBookings(token: SessionToken): Promise<Array<UserBooking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, passwordHash: string): Promise<SessionToken>;
    registerUser(email: string, passwordHash: string, name: string, phone: string | null): Promise<SessionToken>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserBooking(token: SessionToken, input: UserBookingInput): Promise<bigint>;
    submitFlightEnquiry(input: FlightEnquiryInput): Promise<bigint>;
    submitPNREnquiry(input: PNREnquiryInput): Promise<bigint>;
    submitTourEnquiry(input: TourEnquiryInput): Promise<bigint>;
    submitVisaEnquiry(input: VisaEnquiryInput): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingPNR(token: SessionToken, bookingId: bigint, pnrNumber: string): Promise<void>;
    updateBookingPaymentStatus(token: SessionToken, bookingId: bigint, paymentStatus: string): Promise<void>;
    updateBookingStatus(token: SessionToken, bookingId: bigint, bookingStatus: string): Promise<void>;
    updateFlightEnquiryStatus(token: SessionToken, id: bigint, status: string): Promise<void>;
    updateTourEnquiryStatus(token: SessionToken, id: bigint, status: string): Promise<void>;
    updateVisaEnquiryStatus(token: SessionToken, id: bigint, status: string): Promise<void>;
    validateSession(token: SessionToken): Promise<User | null>;
}
