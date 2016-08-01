export class Transaction {
    externalRef: string;
    id: string;
    referenceId: string;
    classification: string;
    description: string;
    date: Date;
    amount: number;
    underlyingAccount: string;
    isPosted: string;
    memberId: string;

     constructor() {
        this.externalRef = "";
        this.id = "";
        this.referenceId = "";
        this.description = "";
        this.classification = "";
        this.amount = 0;
        this.date = new Date();
        this.underlyingAccount = "";      
        this.isPosted = "N"; 
        this.memberId = "";
    }

    createIdFromKey(key: number): string {
        let keyStr = "TRN" + key;
        if (key < 1000) {
            keyStr = "TRN" + ("0000" + key).slice(-4);
        }
        return keyStr;
    }
}