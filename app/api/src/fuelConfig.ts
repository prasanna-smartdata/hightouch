
import { getAppConfig } from "./config";
const appConfig = getAppConfig();
export const fuelConfig = {
    clientId: appConfig.sfmcClientId,
    clientSecret: appConfig.sfmcClientSecret,
    origin: 'https://mcftllc2rwg-b3-r6878b77j8gv4.rest.marketingcloudapis.com', //For Oauth2, Origin should be your Rest Tenant Specific Endpoint
    authOrigin: 'https://mcftllc2rwg-b3-r6878b77j8gv4.auth.marketingcloudapis.com', //For Oauth2, AuthOrigin  should be your Rest Tenant Specific Endpoint
    soapOrigin: 'https://mcftllc2rwg-b3-r6878b77j8gv4.soap.marketingcloudapis.com', //For Oauth2, SoapOrigin should be your Rest Tenant Specific Endpoint


};