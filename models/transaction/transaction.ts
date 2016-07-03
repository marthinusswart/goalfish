export class Transaction {
    externalRef: string;
    id: string;
    referenceId: string;
    classification: string;
    description: string;
    date: Date;
    amount: number;
    underlyingAccount: string;
}