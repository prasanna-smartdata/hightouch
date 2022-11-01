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

    export interface RequestSetupBody {
        keys: {
            "Hightouch PrimaryId": string
        },
        values: {
            "S2S Verify": boolean,
            "Config Complete": boolean

        }

    }


    export interface requestWithAccountId {
        accountId: string;
    }
    export interface UpdateDateExtensionBody {
        primaryColumn: string;
        primaryColumnValue: string;
        updateColumnOne: string;
        updateColumnOneValue: boolean;
        updateColumnTwo: string;
        updateColumnTwoValue: boolean;

    }

    export interface ISetupStatus {
        primaryKey: string,
        isS2SCompleted: boolean,
        isConfigCompleted: boolean
    }
}