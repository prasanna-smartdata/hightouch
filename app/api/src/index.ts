import https from "https";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

import express, { Request, Response } from "express";

// Middleware
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import csurf from "csurf";
import ejs from "ejs";
import morgan from "morgan";
import { getAppConfig, getAppPort, isDev } from "./config";
import { clientErrorHandler, errorHandler } from "./errors";
import routes from "./routes";
import { getCookieOptions } from "./cookies";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Make sure we initialize the app config from the env vars
// as early as possible.
const appConfig = getAppConfig();

const app = express();
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
// Set the EJS `renderFile` function as the view render
// function for HTML files. This allows us to use EJS
// inside files with the .html extension instead of .ejs.
app.engine("html", ejs.renderFile);

// Add the request logging middleware.
// Use the `dev` predefined format for local development purposes
// so that we get colored log output, but for all other times
// use the `common` format which following the Apache log
// format.
app.use(morgan(isDev() ? "dev" : "common"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    bodyParser.json({
        type: ["application/json"],
    })
);



app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                frameAncestors: [
                    "https://*.exacttarget.com",
                    "https://*.marketingcloudapps.com",
                ],
                connectSrc: ["'self'", "https://*.marketingcloudapis.com/"],
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                scriptSrc: ["'self'"],
            },
        },
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
        // Need to turn-off the Cross-Origin-Embedder-Policy to allow images
        // from Vimeo's CDN to be loaded.
        crossOriginEmbedderPolicy: false,
        // Disable the X-FRAME-OPTIONS header. We'll just use CSP.
        // This does mean that older browsers that do not know how
        // to read the CSP header will be able to iframe this app.
        // However, we also have a check that disables the app
        // from functioning when its parent is not SFMC. The
        // UI has the logic to do that. So we are effectively
        // protected from malicious sites trying to embed
        // this app.
        frameguard: false,
    })
);


app.use(cookieParser(appConfig.cookieSecret));
app.use(
    csurf({
        cookie: {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            signed: true,
        },
        value: (req) => req.signedCookies["XSRF-Token"],
    })
);

app.use("/assets", express.static(join(__dirname, "ui")));

// Setup the error handling middlewares last.
app.use(clientErrorHandler);
app.use(errorHandler);

routes(app);

app.get("/*", (req: Request, res: Response) => {
    res.cookie("XSRF-Token", req.csrfToken(), getCookieOptions());
    if (isDev() && appConfig.redirectUiToLocalhost) {
        console.log("Redirecting to localhost UI...");

        res.redirect("https://app.localhost:3000");
        return;
    }
    res.sendFile(join(__dirname, "ui", "index.html"));
});

const port = getAppPort();
if (isDev()) {
    console.log("Starting HTTPS server for local development");
    const options = {
        key: readFileSync(join(__dirname, "..", "localhost.key")),
        cert: readFileSync(join(__dirname, "..", "localhost.crt")),
    };
    https.createServer(options, app).listen(443);
} else {
    app.listen(port, () => console.log(`Listening on port ${port}`));
}
