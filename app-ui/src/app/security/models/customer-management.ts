import { Contract } from "./contracts";

export interface Customer {
    id: number;
    name: string;
    description: string;
    activationDate: Date;
    autoRenewal: boolean;
    expiringDate: Date;
    contract: Contract;
}

export interface Facility {
    id: number;
    name: string;
    abbreviation: string;
    zipCode: string;
    address1: string;
    address2: string;
    city: string;
    contactPhone: string;
    contactEmail: string;
    facilityStandardDepartments: StandardDepartment[];
}

export interface StandardDepartment {
    id: number;
    name: string;
    description: string;
}