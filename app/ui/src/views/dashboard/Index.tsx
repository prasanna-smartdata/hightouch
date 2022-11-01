import { SLDSSpinner } from "@salesforce/design-system-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISetupStatus } from "types";
import {
    checkSetupDataExtension,
    checKSyncsDataExtension,
    createSetupDataExtension,
    createSyncsDataExtension,
    getSetupDataExtensionData,
    getUserInfo,
} from "../../actions/ApiActions";
import { refreshSfmcToken } from "../../sfmcClient";
import { withDashboard } from "./withDashboard";

const setupStatus: ISetupStatus = {
    isConfigCompleted: false,
    primaryKey: "",
    isS2SCompleted: false,
};
const RouterIndex = () => {
    const [accountId, setAccountId] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [syncsCreated, setSyncsDeCreated] = useState(false);
    const [setupCreated, setSetupCreated] = useState(false);
    let navigate = useNavigate();
    useEffect(() => {
        refreshSfmcToken().then((resp: any) => {
            if (resp.status === 200) {
                //Getting the userInfo
                getUserInfo().then(async (response: any) => {
                    if (response) {
                        setAccountId(response.accountId);
                        setEmail(response.email);
                        setUserId(response.userId);
                    }

                    //Check Setup data extenion already available or not
                    await checkSetupDataExtension().then((resp: any) => {
                        if (!resp) {
                            createSetupDataExtension({
                                accountId: response.accountId,
                            }).then((result: boolean) => {
                                if (result) {
                                    setSetupCreated(true);
                                }
                            });
                        } else {
                            setSetupCreated(true);
                        }
                    });
                });
            }
        });
    }, []);

    //For Syncs DE
    useEffect(() => {
        if (setupCreated) {
            //Check Syncs data extension already available or not
            checKSyncsDataExtension().then((resp: any) => {
                if (!resp) {
                    createSyncsDataExtension({
                        accountId: accountId,
                    }).then((result: boolean) => {
                        if (result) {
                            setSyncsDeCreated(true);
                        }
                    });
                } else {
                    setSyncsDeCreated(true);
                }
            });
        }
    }, [setupCreated]);

    //If both Syncs and Setup DE are created then do the route
    useEffect(() => {
        if (setupCreated && syncsCreated) {
            getSetupDataExtensionData().then((resp: any) => {
                const data = resp.data;
                if (Array.isArray(data)) {
                    const isS2SCompleted = data[0].Property[0].Value[0];
                    setupStatus.isS2SCompleted =
                        isS2SCompleted === "True" ? true : false;

                    const isFinished = data[0].Property[1].Value[0];
                    setupStatus.isConfigCompleted =
                        isFinished === "True" ? true : false;

                    //If the setup is completed redirect to dashboard else redirect to setup page1
                    if (setupStatus.isConfigCompleted) {
                        let path = "/dashboard";
                        navigate(path);
                    } else {
                        let path = "/setup/CheckApplicationDetails";
                        navigate(path);
                    }
                } else {
                    let path = "/setup/CheckApplicationDetails";
                    navigate(path);
                }
            });
        }
    }, [setupCreated, syncsCreated]);

    return (
        <div className="slds-m-top_x-large">
            <div style={{ position: "relative", height: "5rem" }}>
                <SLDSSpinner
                    containerClassName="slds-is-expanded"
                    size="medium"
                    variant="brand"
                    assistiveText={{
                        label: "Loading...",
                    }}
                />
            </div>
        </div>
    );
};

export const DashboardRouter = withDashboard(RouterIndex);
