declare module "types" {
    export interface AuthRequestBody {
        clientId: string;
        secretKey: string;
    }
    export interface RequestWithAccountId {
        accountId: string
    }
    export interface HightouchRequestBody {
        accountId: string,
        userId: string,
        email: string,
        clientId: string;
        secretKey: string;
    }
    export interface RequestSyncBody {
        keys: {
            Model: string
        },
        values: {
            Schedule: string,
            Status: string,
            "Last Run": date
        }

    }
}