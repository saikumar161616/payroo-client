export interface Bank {
    bsb: string;
    account: string;
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    baseHourlyRate: number;
    superRate: number;
    bank: Bank;
    status: string;
}