import { Config, DataExtensionConfig } from "app";

const defaultPort = 8080;

function getEnvVar(
    envVar: string,
    required = true,
    defaultValue?: string
): string {
    const value = process.env[envVar];
    if (!value && required) {
        throw new Error(`${envVar} is required`);
    }

    return value || defaultValue || "";
}

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

export function getAppPort(): number {
    const port = process.env.PORT;
    if (!port) {
        return defaultPort;
    }

    return parseInt(port, 10);
}

//Reading the Application level settings from .env
export function getAppConfig(): Config {
    return {
        cookieSecret: getEnvVar("COOKIE_SECRET_KEY"),
        jwtSecret: getEnvVar("JWT_SECRET"),
        redirectUiToLocalhost:
            getEnvVar("REDIRECT_UI_TO_LOCALHOST", false, "false") === "true"
                ? true
                : false,
        selfDomain: getEnvVar("SELF_DOMAIN", false, "http://localhost:8080"),
        sfmcClientId: getEnvVar("SFMC_CLIENT_ID"),
        sfmcClientSecret: getEnvVar("SFMC_CLIENT_SECRET"),
        sfmcHightouchToken: getEnvVar("SFMC_HIGHTOUCH_TOKEN"),
        //This sub-domain comes from Hightouch BU in martek account
        sfmcDefaultTenantSubdomain: getEnvVar(
            "SFMC_DEFAULT_TENANT_SUBDOMAIN",
            false,
            "mcftllc2rwg-b3-r6878b77j8gv4"
        ),
    };
}

//Reading the Syncs Data Extension name and keys from .env
export function getSyncDEConfig(): DataExtensionConfig {
    return {
        deName: getEnvVar("SYNC_DATA_EXTENSION_NAME"),
        deCustomerKey: getEnvVar("SYNC_DATA_EXTENSION_CUSTOMER_KEY"),
    };
}
//Reading the Setup Data Extension name and keys from .env
export function getSetupDEConfig(): DataExtensionConfig {
    return {
        deName: getEnvVar("SETUP_DATA_EXTENSION_NAME"),
        deCustomerKey: getEnvVar("SETUP_DATA_EXTENSION_CUSTOMER_KEY"),

    };
}