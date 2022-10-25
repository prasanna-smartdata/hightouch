import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import { Panel } from "@salesforce/design-system-react";

import AppDetails from "./views/ApplicationSetup";
import Review from "./views/ReviewSetup";
import Header from "./components/Header";
import { NavigationProvider } from "./components/NavigationContext";
import { refreshSfmcToken } from "./sfmcClient";
import {
    checkDataExtension,
    createDataExtension,
    getUserInfo,
} from "./actions/ApiActions";

function App() {
    const [deCreated, setDeCreated] = useState(false);
    const [accountId, setAccountId] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    useEffect(() => {
        refreshSfmcToken().then((resp: any) => {
            if (resp.status === 200) {
                //Getting the userInfo
                getUserInfo().then((response: any) => {
                    if (response) {
                        setAccountId(response.accountId);
                        setEmail(response.email);
                        setUserId(response.userId);
                    }

                    //Check data extension already available or not
                    checkDataExtension().then((resp: any) => {
                        if (!resp) {
                            createDataExtension({
                                accountId: response.accountId,
                            }).then((result: boolean) => {
                                if (result) {
                                    setDeCreated(true);
                                }
                            });
                        } else {
                            setDeCreated(true);
                        }
                    });
                });
            }
        });
    }, []);

    return (
        <div>
            <NavigationProvider>
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
                                        path="/CheckApplicationDetails"
                                        element={<AppDetails />}
                                    />
                                    <Route
                                        path="/ReviewSetup"
                                        element={<Review />}
                                    />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </Panel>
            </NavigationProvider>
        </div>
    );
}

export default App;
