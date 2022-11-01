import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {
    BrandBand,
    Button,
    Input,
    SLDSSpinner,
} from "@salesforce/design-system-react";
import * as columnNames from "../constants/ColumnConstants";
import {
    getUserInfo,
    updateSetupDataExtensionData,
    verifYServer2ServerOAuth,
} from "../actions/ApiActions";
import { withNavigation } from "../components/withNavigation";
import { UtilityIcon } from "../components/icons/UtilityIcon";
import {
    AuthRequestBody,
    RequestSetupBody,
    UpdateDateExtensionBody,
} from "types";
import { getSetupUpsertRequestBody } from "../actions/Helper";

function AppDetails(prop: any) {
    const [client, setclientid] = useState("");
    const [secret, setsecret] = useState("");
    const [accountId, setAccountId] = useState("");
    const [email, setEmail] = useState("");
    const [subDomain, setSubDomain] = useState("");
    const [userId, setUserId] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const getcid = (e: any) => {
        setclientid(e.target.value);
    };
    const getsecret = (e: any) => {
        setsecret(e.target.value);
    };

    //Fires when user clicks the "Verify My Account"
    const verifyAccount = () => {
        const request: AuthRequestBody = {
            clientId: client,
            secretKey: secret,
        };
        setShowSpinner(true);
        verifYServer2ServerOAuth(request).then((response: any) => {
            if (response === "valid") {
                setShowSuccess(true);
                setShowSpinner(false);
                getUserInfo().then((response: any) => {
                    if (response) {
                        setAccountId(response.accountId);
                        setUserId(response.userId);
                        setEmail(response.email);
                        setSubDomain(response.subdomain);
                    }
                });
            } else {
                setShowSpinner(false);
                setShowError(true);
                setIsValid(false);
            }
        });
    };

    //Next button event handler
    const nextHandler = async (e: any) => {
        setShowSpinner(true);
        let isProccessed = false;
        try {
            prop.updateState(true, true, true, false);

            const body = getSetupUpsertRequestBody(true, false);

            const response = await updateSetupDataExtensionData(body);

            if (response?.data.status === 200) {
                prop.updateSetupState({
                    isS2SCompleted: true,
                    isConfigCompleted: false,
                });
                setShowSpinner(false);
            }
            setShowSpinner(false);
        } catch (error) {
            setShowSpinner(false);
        }
    };
    const footerClass = classNames({
        "slds-is-expanded": showSuccess,
        "slds-is-collapsed": !showSuccess,
    });
    const errorFooterClass = classNames({
        "slds-is-expanded": showError,
        "slds-is-collapsed": !showError,
    });

    const spinnerClass = classNames({
        "slds-is-expanded": showSpinner,
        "slds-is-collapsed": !showSpinner,
    });
    return (
        <div className="slds-form-element  ">
            <div className="slds-m-top_xxx-small slds-float_top">
                <div
                    id="foot"
                    className={footerClass}
                    style={{
                        position: "fixed",
                        width: "100%",
                        left: "0px",
                        top: "0",
                    }}
                >
                    <div className="slds-notify_container slds-is-relative">
                        <div
                            className="slds-notify slds-notify_toast slds-theme_success"
                            role="status"
                        >
                            <span className="slds-assistive-text">success</span>
                            <span
                                className="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top"
                                title="Description of icon when needed"
                            >
                                <UtilityIcon
                                    svgClass="slds-icon slds-icon_small"
                                    iconName="success"
                                />
                            </span>
                            <div>
                                <div className="slds-text-heading_small">
                                    SFMC App Credentials Verified{" "}
                                </div>
                            </div>
                            <div className="slds-notify__close">
                                <Button
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        setShowSuccess(false);
                                        setIsValid(true);
                                    }}
                                    style={{
                                        background: "fixed",
                                        border: "none",
                                    }}
                                    className="slds-button  slds-button_icon  slds-button_icon-inverse"
                                    title="Close"
                                >
                                    <UtilityIcon
                                        svgClass="slds-button__icon slds-button__icon_large"
                                        iconName="close"
                                    />
                                    <span className="slds-assistive-text">
                                        Close
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    id="errorfoot"
                    className={errorFooterClass}
                    style={{
                        position: "fixed",
                        width: "100%",
                        left: "0px",
                        top: "0",
                    }}
                >
                    <div className="slds-notify_container slds-is-relative">
                        <div
                            className="slds-notify slds-notify_toast slds-theme_error"
                            role="status"
                        >
                            <span className="slds-assistive-text">error</span>
                            <span
                                className="slds-icon_container slds-icon-utility-error slds-m-right_small slds-no-flex slds-align-top"
                                title="Description of icon when needed"
                            >
                                <UtilityIcon
                                    svgClass="slds-icon slds-icon_small"
                                    iconName="error"
                                />
                            </span>
                            <div className="slds-notify__content">
                                <h2 className="slds-text-heading_small ">
                                    {" "}
                                    Verification failed.Please check the
                                    credentials
                                </h2>
                            </div>
                            <div className="slds-notify__close">
                                <Button
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        setShowError(false);
                                    }}
                                    style={{
                                        background: "fixed",
                                        border: "none",
                                    }}
                                    className="slds-button  slds-button_icon  slds-button_icon-inverse"
                                    title="Close"
                                >
                                    <UtilityIcon
                                        svgClass="slds-button__icon slds-button__icon_large"
                                        iconName="close"
                                    />
                                    <span className="slds-assistive-text">
                                        Close
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="slds-m-top_x-small">
                <BrandBand id="brand-band-no-image" theme="lightning-blue">
                    <div id="form1card">
                        <div className="slds-box slds-theme_default slds-text-heading_label slds-m-left_xx-small slds-m-right_xx-small">
                            <div className="slds-text-heading_small  slds-truncate">
                                Server 2 Server Application Details
                            </div>
                        </div>

                        <form>
                            <div className="slds-clearfix">
                                <div className="slds-col slds-size_2-of-6 slds-grid_pull-padded">
                                    <div className="slds-col_padded">
                                        <div className="slds-col_padded">
                                            <Input
                                                aria-describedby="error-4"
                                                id="unique-id-4"
                                                required
                                                onChange={getcid}
                                                label="Client ID"
                                                placeholder="Enter Client ID "
                                            />
                                        </div>
                                    </div>
                                    <div className="slds-col_padded slds-m-left_none">
                                        <div className="slds-col_padded">
                                            <Input
                                                aria-describedby="error-4"
                                                id="unique-id-5"
                                                label="Client Secret"
                                                required
                                                placeholder="Enter Secret Key"
                                                onChange={getsecret}
                                            />
                                        </div>
                                    </div>

                                    <div className=" slds-col_padded slds-float_right slds-m-top_x-small  slds-m-right_x-small ">
                                        <Button
                                            variant="brand"
                                            name="verify"
                                            label="Verify My Account"
                                            onClick={verifyAccount}
                                        >
                                            {" "}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{ position: "relative", height: "5rem" }}
                            >
                                <SLDSSpinner
                                    containerClassName={spinnerClass}
                                    size="medium"
                                    variant="brand"
                                    assistiveText={{
                                        label: "Validating...",
                                    }}
                                />
                            </div>

                            <div className="slds-float_right slds-m-right_x-small">
                                <Button id="button" disabled={!isValid}>
                                    <Link
                                        onClick={nextHandler}
                                        to="/setup/ReviewSetup"
                                        state={{
                                            client: client,
                                            secret: secret,
                                            userId: userId,
                                            email: email,
                                            accountId: accountId,
                                            subDomain: subDomain,
                                        }}
                                    >
                                        Next
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </div>
                    <br></br>
                </BrandBand>
            </div>
        </div>
    );
}
export default withNavigation(AppDetails);
