export class CreditNote {
    externalRef: string;
    id: string;
    name: string;
    description: string;
    amount: number;
    fromAccount: string;
    toAccount: string;
    memberId: string;
    date: Date;
    state: string;

     constructor() {
        this.externalRef = "";
        this.id = "";
        this.name = "";
        this.description = "";
        this.amount = 0;
        this.date = new Date();
        this.state = "Pending";
    }

     createIdFromKey(key: number): string {
        let keyStr = "CRN" + key;
        if (key < 1000) {
            keyStr = "CRN" + ("0000" + key).slice(-4);
        }
        return keyStr;
    }
}