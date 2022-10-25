import * as axios from "axios";

export const settings = {
    accessTokenCookieName: "sfmc_access_token",
    tenantSubDomainCookieName: "sfmc_tssd",
    tokenRefreshInterval: 15 * 60 * 1000,
    maxTokenLifetime: 20 * 60 * 1000,
};

const client = axios.default.create({
    timeout: 20 * 1000,
});

client.interceptors.response.use(undefined, (err) => {
    if (err.response.status === 401) {
        window.location.href = "/oauth2/sfmc/authorize";
        return;
    }

    return Promise.reject(err);
});

//Call this method in App.tsx
export async function refreshSfmcToken() {
    try {
        const response = await client.post("/oauth2/sfmc/refresh_token");

        setTimeout(refreshSfmcToken, settings.tokenRefreshInterval);

        return response;

    } catch (err) {
        console.error(
            "Error occurred while trying to refresh the token. Won't schedule the auto refresh."
        );
        console.error(err);
    }
}
