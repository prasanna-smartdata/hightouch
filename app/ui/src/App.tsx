import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Panel } from "@salesforce/design-system-react";

import AppDetails from "./views/ApplicationSetup";
import Review from "./views/ReviewSetup";
import Header from "./components/Header";
import { NavigationProvider } from "./components/NavigationContext";
import { refreshSfmcToken } from "./sfmcClient";
import {
    checkSetupDataExtension,
    checKSyncsDataExtension,
    createSetupDataExtension,
    createSyncsDataExtension,
    getSetupDataExtensionData,
    getUserInfo,
} from "./actions/ApiActions";
import { ISetupStatus } from "types";

function App() {
    return (
        <div>
            <Panel>
                <div className="slds-m-top_small ">
                    <div className=" slds-text-heading_medium slds-m-left_small">
                        Configuration Pages
                    </div>

                    <div
                        className="slds-box slds-m-top_small slds-m-bottom_small slds-m-left_small slds-m-right_small"
                        style={{
                            height: "650px",
                            padding: "0px",
                        }}
                    >
                        <div className="slds-border_bottom">
                            <Header></Header>
                        </div>

                        <div className=" slds-m-bottom_x-large  slds-m-top_small  slds-m-left_small slds-m-top_small  slds-m-right_small slds-border_bottom slds-border_top slds-border_left slds-border_right ">
                            <Routes>
                                <Route index element={<AppDetails />} />
                                <Route
                                    path="CheckApplicationDetails"
                                    element={<AppDetails />}
                                />
                                <Route
                                    path="ReviewSetup"
                                    element={<Review />}
                                />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default App;
