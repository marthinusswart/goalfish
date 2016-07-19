export class Journal {
    externalRef: string;
    id: string;
    name: string;
    description: string;
    date: Date;
    amount: number;
    accountNumber: string;
    isPosted: string;

      constructor() {
        this.externalRef = "";
        this.id = "";
        this.name = "";
        this.description = "";
        this.amount = 0;
        this.date = new Date();
        this.accountNumber = "";
        this.isPosted = "N";
    }

     createIdFromKey(key: number): string {
        let keyStr = "JNL" + key;
        if (key < 1000) {
            keyStr = "JNL" + ("0000" + key).slice(-4);
        }
        return keyStr;
    }
}