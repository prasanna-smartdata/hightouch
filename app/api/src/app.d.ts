
declare module "app" {
    export interface Config {
        cookieSecret: string;
        jwtSecret: string;
        redirectUiToLocalhost: boolean;
        selfDomain: string;
        sfmcClientId: string;
        sfmcClientSecret: string;
        sfmcDefaultTenantSubdomain: string;
        sfmcHightouchToken: string;
    }
    export interface DataExtensionConfig {
        deName: string;
        deCustomerKey: string;
        dePrimaryKey?: string;
    }

    export interface Connect {
        accountId: string,
        userId: string,
        email: string,
        resources: {
            subdomain: string,
            clientId: string,
            clientSecret: string
        }
    }
}
