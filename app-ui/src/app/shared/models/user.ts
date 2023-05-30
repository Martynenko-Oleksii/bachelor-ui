export interface UserLogin {
    userName: string;
    password: string;
}

export interface User {
    id: string;
    userName: string;
    fullName: string;
}

export interface AuthUser {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    token: string;
    roles: string[];
    customerId: number;
    customer: string;
    email: string;
    lastSignIn: Date;
    firstSignIn: boolean;
}

export interface ProfileInfo {
    firstName: string;
    lastName: string;
    email: string;
    oldPassword: string;
    password: string;
}