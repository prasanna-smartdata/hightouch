import {
    healthCheck,
    authorize,
    oAuthCallback,
    refreshToken,
    onError,
    verifYServer2ServerOAuth,
    getUserInfo,
    connectToHightouch,
    getHightouchSyncs,
    getHightouchDestinations,
    checkSyncsDataExtensionWithSoap,
    getSyncsDataExtension,
    upsertSyncsDataExtension,
    createSyncsDataExtensionWithSoap,
    checkSetupDataExtensionWithSoap,
    createSetupDataExtensionWithSoap,
    getSetupDataExtension,
    upsertSetupDataExtension,
} from "./controller";
import express from "express";

export default (app: any) => {
    const router = express.Router();
    //To test the server is running
    router.get("/api/healthcheck", healthCheck);
    router.get("/oauth2/sfmc/authorize", authorize);
    router.get("/oauth2/sfmc/callback", oAuthCallback);
    router.post("/oauth2/sfmc/refresh_token", refreshToken);
    router.post("/api/sfmc/verifys2s", verifYServer2ServerOAuth);
    router.get("/api/sfmc/getuserinfo", getUserInfo);
    router.get("/api/sfmc/checkSyncsDataExtension", checkSyncsDataExtensionWithSoap);
    router.get("/api/sfmc/getSyncsDataExtension", getSyncsDataExtension);
    router.post("/api/sfmc/createSyncsDataExtension", createSyncsDataExtensionWithSoap);
    router.post("/api/sfmc/upsertSyncsDataExtension", upsertSyncsDataExtension);
    router.get("/api/sfmc/checkSetupDataExtension", checkSetupDataExtensionWithSoap);
    router.get("/api/sfmc/getSetupDataExtension", getSetupDataExtension);
    router.post("/api/sfmc/createSetupDataExtension", createSetupDataExtensionWithSoap);
    router.post("/api/connect-hightouch", connectToHightouch);
    router.post("/api/sfmc/updateSetupDataExtension", upsertSetupDataExtension);
    router.get("/api/hightouch/destinations", getHightouchDestinations);
    router.get("/api/hightouch/syncs", getHightouchSyncs);
    router.get("/api/oauth2/error", onError);

    app.use(router);
};
