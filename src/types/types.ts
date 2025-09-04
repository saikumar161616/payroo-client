export interface Bank {
    bsb: string;
    account: string;
};

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
};

export interface Payslip {
    employeeId: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    gross: number;
    tax: number;
    net: number;
    super: number;
    normalHours: number;
    overtimeHours: number;
}