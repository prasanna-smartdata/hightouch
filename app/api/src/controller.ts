import { getAppConfig, getDEConfig } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { AccessTokenResponse } from "sfmc";
import { sfmcClient } from "./sfmcClient";
import { Connect } from "app";
import xml2js from "xml2js";
import {
    getCookieOptions,
    ONE_HOUR_IN_SECONDS,
    TWENTY_MINS_IN_SECONDS,
} from "./cookies";
import { getCheckDEPayload, getCreateDEPayload, getDEDataPayload } from "./soapMethodCalls";

//xml to json
var parser = new xml2js.Parser();
const appConfig = getAppConfig();
const deConfig = getDEConfig();
const sfmcOAuthCallbackPath = "/oauth2/sfmc/callback";

export const healthCheck = (_req: Request, res: Response) => {
    return res.status(200).send("OK");
};

export const authorize = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    const authUrl = new URL(
        `https://${appConfig.sfmcDefaultTenantSubdomain}.auth.marketingcloudapis.com/v2/authorize`
    );
    authUrl.searchParams.append("client_id", appConfig.sfmcClientId);
    authUrl.searchParams.append(
        "redirect_uri",
        `${appConfig.selfDomain}${sfmcOAuthCallbackPath}`
    );
    authUrl.searchParams.append("response_type", "code");

    try {
        // Generate a signed string that can be validated in the callback.
        const state = jwt.sign({}, appConfig.jwtSecret, {
            expiresIn: "10m",
        });
        authUrl.searchParams.append("state", state);

        res.redirect(authUrl.toString());
        return;
    } catch (err) {
        console.error("Failed to create a signed JWT. ", err);
    }

    next(
        new Error("An error occurred while generating the authorization URL.")
    );
};

async function verifyOAuth2Callback(
    req: Request,
    next: NextFunction
): Promise<string | undefined> {
    const code = req.query.code as string;
    if (!code) {
        console.error("SFMC OAuth callback didn't have the code query-param");
        next(new Error("invalid_request: Missing code param"));
        return;
    }

    const state = req.query.state as string;
    if (!state) {
        console.error("SFMC OAuth callback didn't have the state query-param");
        next(new Error("invalid_request: Missing state param"));
        return;
    }

    try {
        await new Promise((resolve, reject) => {
            jwt.verify(
                state as string,
                appConfig.jwtSecret,
                {
                    algorithms: ["HS256"],
                },
                (err, decoded) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(decoded);
                }
            );
        });
    } catch (err) {
        console.error("Unable to verify the state param.", err);
        next(new Error("invalid_request: Invalid state param"));
        return;
    }

    return code;
}

export const oAuthCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const code = await verifyOAuth2Callback(req, next);
    const tssd = req.query.tssd || appConfig.sfmcDefaultTenantSubdomain;
    const resp = await sfmcClient.post<AccessTokenResponse>(
        `https://${tssd}.auth.marketingcloudapis.com/v2/token`,
        {
            grant_type: "authorization_code",
            code,
            client_id: appConfig.sfmcClientId,
            client_secret: appConfig.sfmcClientSecret,
            redirect_uri: `${appConfig.selfDomain}${sfmcOAuthCallbackPath}`,
        }
    );

    const accessTokenResp = resp.data;

    res.cookie(
        "sfmc_access_token",
        accessTokenResp.access_token,
        getCookieOptions(TWENTY_MINS_IN_SECONDS)
    );
    res.cookie(
        "sfmc_refresh_token",
        accessTokenResp.refresh_token,
        getCookieOptions(ONE_HOUR_IN_SECONDS)
    );

    res.cookie("sfmc_tssd", tssd, getCookieOptions(TWENTY_MINS_IN_SECONDS));

    res.redirect("/");
};

export const verifYServer2ServerOAuth = async (req: Request, res: Response) => {
    //Reading the tssd from the cookie.
    const tssd =
        req.signedCookies["sfmc_tssd"] || appConfig.sfmcDefaultTenantSubdomain;
    try {
        await sfmcClient.post<AccessTokenResponse>(
            `https://${tssd}.auth.marketingcloudapis.com/v2/token`,
            {
                grant_type: "client_credentials",
                scope: "email_read email_write email_send",
                client_id: req.body.clientId,
                client_secret: req.body.secretKey,
            }
        );
        return res.sendStatus(200);
    } catch (err: any) {
        return res.status(400).send();
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const tssd = req.signedCookies["sfmc_tssd"];
        const sfmcToken = req.signedCookies["sfmc_access_token"];

        const resp = await axios.get(
            `https://${tssd}.auth.marketingcloudapis.com/v2/userinfo`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sfmcToken}`,
                },
            }
        );

        const userId = resp.data.user.sub;
        const email = resp.data.user.email;
        const accountId = resp.data.organization.member_id;
        return res.send({
            userId: userId,
            email: email,
            accountId: accountId,
            subdomain: tssd,
        });
    } catch (error) {
        return res.send(error);
    }
};
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        !req.signedCookies["sfmc_tssd"] ||
        !req.signedCookies["sfmc_refresh_token"]
    ) {
        res.status(401).send();
        return;
    }

    const tssd = req.signedCookies["sfmc_tssd"];
    const refreshToken = req.signedCookies["sfmc_refresh_token"];

    try {
        const resp = await sfmcClient.post<AccessTokenResponse>(
            `https://${tssd}.auth.marketingcloudapis.com/v2/token`,
            {
                grant_type: "refresh_token",
                client_id: appConfig.sfmcClientId,
                client_secret: appConfig.sfmcClientSecret,
                refresh_token: refreshToken,
            }
        );
        const accessTokenResp = resp.data;
        res.cookie(
            "sfmc_access_token",
            accessTokenResp.access_token,
            getCookieOptions(TWENTY_MINS_IN_SECONDS)
        );
        res.cookie("sfmc_tssd", tssd, getCookieOptions(TWENTY_MINS_IN_SECONDS));
        res.cookie(
            "sfmc_refresh_token",
            accessTokenResp.refresh_token,
            getCookieOptions(ONE_HOUR_IN_SECONDS)
        );

        res.status(200).send();
    } catch (err: any) {
        if (err.response?.data && err.response.data.error === "invalid_token") {
            console.error(err.response.data);
            res.status(401).send();
            return;
        }
        console.error("Failed to refresh SFMC token", err);
        next(err);
    }
};

export const connectToHightouch = async (req: Request, res: Response) => {
    try {
        const payLoad: Connect = {
            accountId: req.body.accountId,
            userId: req.body.userId,
            email: req.body.email,
            resources: {
                subdomain: req.signedCookies["sfmc_tssd"],
                clientId: req.body.clientId,
                clientSecret: req.body.secretKey,
            },
        };

        const resp = await axios.post(
            `https://api.hightouch.io/api/partner-connect/v1/sfmc/connect`,
            payLoad,
            {
                headers: {
                    Authorization: "Basic c2ZtYzp3eEVHQnRDb1VNOXR5VDBvOXNCaA==",
                    "Content-Type": "application/json",
                },
            }
        );

        return res.status(200).send(resp.data);
    } catch (error) {
        console.log("Error:", error);
    }
};

//Creates the data extension
export const createDataExtensionWithSoap = async (
    req: Request,
    res: Response
) => {
    //Reading the tssd from the cookie.
    const tssd =
        req.signedCookies["sfmc_tssd"] || appConfig.sfmcDefaultTenantSubdomain;
    const accessToken = req.signedCookies["sfmc_access_token"];
    const accountId = req.body.accountId;
    const deName = deConfig.deName;
    const deCustomerKey = deConfig.deCustomerKey;

    try {
        var data = getCreateDEPayload(accessToken, accountId, deCustomerKey, deName);
        const config = {
            method: "post",
            url: `https://${tssd}.soap.marketingcloudapis.com/Service.asmx`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "text/xml",
            },
            data: data,
        };

        const response = await axios(config);
        //Parsing the response soap xml
        const result = await parser.parseStringPromise(response.data);
        var soapBody = result["soap:Envelope"]["soap:Body"];
        const RetrieveResponseMsg =
            soapBody[0].CreateResponse[0].Results[0].StatusCode;
        if (RetrieveResponseMsg[0] === "OK") {
            return res.status(200).send("Ok");
        } else {
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log("error in create DE", error);
        return res.sendStatus(500);
    }
};

//Checks whether DE is available or not
export const checkDataExtensionWithSoap = async (req: any, res: any) => {
    //Reading the tssd from the cookie.
    const tssd =
        req.signedCookies["sfmc_tssd"] || appConfig.sfmcDefaultTenantSubdomain;
    const accessToken = req.signedCookies["sfmc_access_token"];
    const deCustomerKey = deConfig.deCustomerKey;
    try {

        var data = getCheckDEPayload(tssd, accessToken, deCustomerKey)
        var config = {
            method: "post",
            url: `https://${tssd}.soap.marketingcloudapis.com/Service.asmx`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "text/xml",
            },
            data: data,
        };

        const resp = await axios(config);
        //Parsing the response soap xml
        const result = await parser.parseStringPromise(resp.data);
        var soapBody = result["soap:Envelope"]["soap:Body"];
        const RetrieveResponseMsg = soapBody[0].RetrieveResponseMsg[0];
        if (RetrieveResponseMsg.OverallStatus[0] === "OK") {
            try {
                if (RetrieveResponseMsg.Results) {
                    const Results = RetrieveResponseMsg.Results[0].Properties;
                    // Results should always be an array
                    return res.status(200).send(Results);
                }
            } catch (error) {
                console.log(error);
            }
            return res.sendStatus(500);
        } else {
            return res.sendStatus(500);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
};

//Insert and update the data in DE
export const upsertDataExtension = async (req: any, res: any) => {
    const tssd =
        req.signedCookies["sfmc_tssd"] || appConfig.sfmcDefaultTenantSubdomain;
    const accessToken = req.signedCookies["sfmc_access_token"];
    const deCustomerKey = deConfig.deCustomerKey;
    const payLoad = req.body;
    try {
        var data = payLoad;

        var config = {
            method: "post",
            url: `https://${tssd}.rest.marketingcloudapis.com/hub/v1/dataevents/key:${deCustomerKey}/rowset`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            data: data,
        };

        const resp = await axios(config);
        if (resp.status === 200) {
            return res.status(200).send("Ok");
        } else {
            return res.status(500).send("Error");
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).send(error);
    }
};
// Getting the DE data
export const getDataExtension = async (req: Request, res: Response) => {
    //Reading the tssd from the cookie.
    const tssd =
        req.signedCookies["sfmc_tssd"] || appConfig.sfmcDefaultTenantSubdomain;
    const accessToken = req.signedCookies["sfmc_access_token"];
    const deName = deConfig.deName;

    try {
        var data = getDEDataPayload(tssd, accessToken, deName);


        var config = {
            method: "post",
            url: `https://${tssd}.soap.marketingcloudapis.com/Service.asmx`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "text/xml",
            },
            data: data,
        };

        const resp = await axios(config);
        const result = await parser.parseStringPromise(resp.data);
        var soapBody = result["soap:Envelope"]["soap:Body"];
        const RetrieveResponseMsg = soapBody[0].RetrieveResponseMsg[0];
        if (RetrieveResponseMsg.OverallStatus[0] === "OK") {
            try {
                if (RetrieveResponseMsg.Results) {
                    const Results = RetrieveResponseMsg.Results[0].Properties;
                    // Results should always be an array
                    return res.status(200).send(Results);
                }
            } catch (error) {
                console.log(error);
            }
            return res.status(200).send("Ok");
        } else {
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).send(error);
    }
};

//Create destinations from Hightouch API
export const getHightouchDestinations = async (
    _req: Request,
    resp: Response
) => {
    try {
        const config = {
            method: "get",
            url: "https://api.hightouch.io/api/v1/destinations?orderBy=id",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${appConfig.sfmcHightouchToken}`,
            },
        };
        const res = await axios(config);
        const results = res.data.data;
        if (results.length !== 0) {
            const sfmcDestinations = results.filter(
                (item: any) => item.type === "sfmc"
            );
            return resp.status(200).send(sfmcDestinations);
        }
    } catch (error) {
        return resp.status(500).send(error);
    }
};

//Getting the all the syncs from hightouch api
export const getHightouchSyncs = async (_req: Request, resp: Response) => {
    try {
        const config = {
            method: "get",
            url: "https://api.hightouch.io/api/v1/syncs?orderBy=id",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${appConfig.sfmcHightouchToken}`,
            },
        };
        const res = await axios(config);
        const results = res.data.data;
        return resp.status(200).send(results);
    } catch (error) {
        return resp.status(500).send(error);
    }
};
export const onError = (req: Request, _res: Response, next: NextFunction) => {
    console.error(
        "Redirected to /oauth2/error while handling:",
        req.headers.referer
    );
    // Call the next() method with an error and let the error handler middleware
    // take care of writing the error response.
    next(new Error());
};

export const logOut = (_req: Request, res: Response) => {
    res.clearCookie("sfmc_access_token");
    res.clearCookie("sfmc_refresh_token");
    res.clearCookie("sfmc_tssd");
    res.clearCookie("XSRF-Token");

    res.status(200).send("You have been successfully logged out!");
};
