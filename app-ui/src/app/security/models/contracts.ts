export interface Contract {
    id: number;
    name: string;
    description: string;
    duration: number;
    start: number;
}

export interface ExpiringContract {
    name: string;
    autoRenewal: boolean;
    expiringDate: Date;
    contract: Contract;
}