export interface SimulateCreditRequest {
    propertyValue: number;
    downPayment: number;
    currency: string;
    annualInterestRate: number;
    termInYears: number;
}

export interface SimulateCreditResponse {
    propertyAmount: number;
    loanAmount: number;
    monthlyPayment: number;
    currency: string;
}

export interface SaveCreditLeadRequest {
    customerEmail: string;
    propertyValue: number;
    downPayment: number;
    loanAmount: number;
    monthlyPayment: number;
    currency: string;
}