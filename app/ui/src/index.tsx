import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";

import "@salesforce-ux/design-system/scss/index.scss";
import "./index.scss";

import {
    IconSettings,
    Settings as SLDSReactSettings,
} from "@salesforce/design-system-react";

import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";
import customSprite from "@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg";
import doctypeSprite from "@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";

import App from "./App";
import { SyncsDashboard } from "./views/dashboard/SyncsDashboard";
import React from "react";
import { Journeys } from "./views/dashboard/Journeys";
import { NavigationProvider } from "./components/NavigationContext";
import { DashboardRouter } from "./views/dashboard/Index";

// Without the following line, an error will be logged every time a modal is rendered.
// See https://react.lightningdesignsystem.com/components/modals/.
(SLDSReactSettings as any).setAppElement("#root");

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

window.addEventListener("error", (err) => console.error("CAUGHT!", err));
window.addEventListener("unhandledrejection", (err) =>
    console.error("CAUGHT unhandledrejection!", err)
);
root.render(
    <NavigationProvider>
        <IconSettings
            iconPath="/assets/icons"
            actionSprite={actionSprite}
            customSprite={customSprite}
            doctypeSprite={doctypeSprite}
            standardSprite={standardSprite}
            utilitySprite={utilitySprite}
        >
            <BrowserRouter>
                <CookiesProvider>
                    <Routes>
                        <Route path="*" element={<DashboardRouter />}></Route>
                        <Route path="setup/*" element={<App />}></Route>
                        <Route path="dashboard" element={<SyncsDashboard />}>
                            <Route
                                path="syncsdashboard"
                                element={<SyncsDashboard />}
                            />
                            <Route path="journeys" element={<Journeys />} />
                        </Route>
                    </Routes>
                </CookiesProvider>
            </BrowserRouter>
        </IconSettings>
    </NavigationProvider>
);
