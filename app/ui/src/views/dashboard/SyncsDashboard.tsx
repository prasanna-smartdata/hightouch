import React, { useEffect, useState } from "react";
import { refreshSfmcToken } from "../../sfmcClient";
import htImage from "../../assets/images/htlogoTile.png";
import {
    checkSetupDataExtension,
    checKSyncsDataExtension,
    createSetupDataExtension,
    createSyncsDataExtension,
    getSetupDataExtensionData,
    getSyncs,
    getUserInfo,
    upsertSyncsDataExtension,
} from "../../actions/ApiActions";
import { ISetupStatus, RequestSyncBody } from "types";
import {
    Button,
    DataTable,
    DataTableColumn,
    Icon,
    PageHeader,
    SLDSSpinner,
} from "@salesforce/design-system-react";
import classNames from "classnames";
import { withDashboard } from "./withDashboard";
import { useNavigate } from "react-router-dom";
const columns = [
    <DataTableColumn key="modelId" label="Model" property="modelId" />,
    <DataTableColumn key="schedule" label="Schedule" property="schedule" />,
    <DataTableColumn key="status" label="Status" property="status" />,
    <DataTableColumn key="lastRunAt" label="Last Run" property="lastRunAt" />,
];

const SyncsDashboardFunction = () => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [showSpinner, setShowSpinner] = useState(true);

    const infoLabel = `${count} Item(s)`;

    const spinnerClass = classNames({
        "slds-is-expanded": showSpinner,
        "slds-is-collapsed": !showSpinner,
    });

    const [syncsCreated, setSyncsDeCreated] = useState(false);
    const [setupCreated, setSetupCreated] = useState(false);


    //Reading the syncs from hightouch api and pushing into Syncs DE
    useEffect(() => {

        //Check the DE is created or not
        checKSyncsDataExtension().then((resp: any) => {
            let syncsObj: RequestSyncBody;
            if (resp) {
                //Get syncs array objects which are of type "sfmc"
                getSyncs().then((data: any) => {
                    setData(data);
                    setShowSpinner(false);
                    setCount(data.length);
                    const payLoad: RequestSyncBody[] = data.map(
                        (item: any) => {
                            return (syncsObj = {
                                keys: {
                                    Model: item.modelId,
                                },
                                values: {
                                    Schedule: item.schedule,
                                    Status: item.status,
                                    "Last Run": item.lastRunAt,
                                },
                            });
                        }
                    );

                    //Upsert DE
                    upsertSyncsDataExtension(payLoad).then(
                        (result: any) => {
                            console.log(" Inserted data into DE");
                        }
                    );
                });
            }
        });

    }, [syncsCreated]);

    return (
        <div className=" slds-m-left_large slds-m-right_large">
            <div className="slds-box   slds-theme_shade slds-m-top_large  slds-text-heading_medium ">
                <img src={htImage} alt="Logo" height={"40px"} width={"40px"} />
                &nbsp;<b>Hightouch Syncs Dashboard</b>
            </div>
            <div className="slds-m-top_large ">
                <PageHeader
                    icon={
                        <Icon
                            assistiveText={{ label: "User" }}
                            category="standard"
                            name="lead"
                        />
                    }
                    info={infoLabel}
                    joined
                    title={
                        <h1 className="slds-page-header__title slds-p-right_x-small">
                            <Button
                                className="slds-button_reset slds-type-focus"
                                iconCategory="utility"
                                iconPosition="right"
                                label="Syncs"
                                responsive
                                variant="base"
                            />
                        </h1>
                    }
                    truncate
                    variant="object-home"
                />
                <DataTable items={data} id="DataTableSyncs">
                    {columns}
                </DataTable>
                <div style={{ position: "relative", height: "5rem" }}>
                    <SLDSSpinner
                        containerClassName={spinnerClass}
                        size="medium"
                        variant="brand"
                        assistiveText={{
                            label: "Validating...",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const SyncsDashboard = withDashboard(SyncsDashboardFunction);
