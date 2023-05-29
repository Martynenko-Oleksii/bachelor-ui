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