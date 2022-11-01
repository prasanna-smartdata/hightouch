import {
    BrandBand,
    Button,
    SLDSSpinner,
} from "@salesforce/design-system-react";
import classNames from "classnames";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HightouchRequestBody } from "types";
import {
    connectToHightouch,
    updateSetupDataExtensionData,
} from "../actions/ApiActions";
import { getSetupUpsertRequestBody } from "../actions/Helper";
import { UtilityIcon } from "../components/icons/UtilityIcon";
import { withNavigation } from "../components/withNavigation";

function Review(prop: any) {
    const [isValid, setIsValid] = useState(false);
    const [redirectUri, setRedirectUri] = useState("");
    const loc: any = useLocation();
    const client: string = loc.state.client;
    const secret: string = loc.state.secret;
    const accountId: string = loc.state.accountId;
    const userId: string = loc.state.userId;
    const email: string = loc.state.email;
    const subDomain: string = loc.state.subDomain;
    const [showSpinner, setShowSpinner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const CreateHightouch = async () => {
        try {
            const request: HightouchRequestBody = {
                accountId: accountId,
                userId: userId,
                email: email,
                clientId: client,
                secretKey: secret,
            };
            setShowSpinner(true);

            connectToHightouch(request)
                .then((response: any) => {
                    if (response.redirect_uri) {
                        setIsValid(true);
                        setShowSuccess(true);
                        setShowSpinner(false);
                        prop.updateState(true, true, true, true);
                        setRedirectUri(response.redirect_uri);
                    } else {
                        setShowSpinner(false);
                        setShowError(true);
                        setIsValid(false);
                    }
                })
                .catch((error) => {
                    console.log("connectToHightouch response error", error);
                    setShowSpinner(false);
                    setShowError(true);
                    setIsValid(false);
                });

            const body = getSetupUpsertRequestBody(true, true);

            const response = await updateSetupDataExtensionData(body);

            if (response?.data.status === 200) {
                prop.updateSetupState({
                    isS2SCompleted: true,
                    isConfigCompleted: true,
                });
            }
            setShowSpinner(false);
        } catch (error) {
            setShowSpinner(false);
        }
    };

    let navigate = useNavigate();
    const routeChange = () => {
        let path = "/dashboard";
        navigate(path);
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
        <div className="slds-form-element ">
            <div className="slds-m-top_x-small">
                <BrandBand id="brand-band-no-image" theme="lightning-blue">
                    <div id="form1card">
                        <div className="slds-box slds-theme_default slds-text-heading_label slds-m-left_xx-small slds-m-right_xx-small">
                            <div className="slds-text-heading_small  slds-truncate">
                                SFMC-HighTouch Details
                            </div>
                        </div>
                        <form>
                            <div className=" slds-m-left_x-large slds-m-top_x-large">
                                <div className="slds-col slds-size_2-of-6 slds-grid_pull-padded">
                                    <div className="slds-grid">
                                        <div className="slds-col ">
                                            <div>
                                                <b>SFMC Cofiguration</b>
                                            </div>

                                            <div className="slds-m-top_xxx-small">
                                                Client ID
                                            </div>
                                            <div className="slds-m-top_xx-small">
                                                {client}
                                            </div>

                                            <div className="slds-m-top_x-small">
                                                Client Secret
                                            </div>
                                            <div className="slds-m-top_xx-small">
                                                {secret}
                                            </div>
                                        </div>
                                        <div className="slds-col">
                                            <div>
                                                <b>Hightouch Cofiguration</b>
                                            </div>
                                            <div className="slds-m-top_xxx-small">
                                                User ID
                                            </div>
                                            <div className="slds-m-top_xxx-small">
                                                {userId}
                                            </div>
                                            <div className="slds-m-top_x-small">
                                                Email
                                            </div>

                                            <div className="slds-m-top_xxx-small">
                                                {email}{" "}
                                            </div>
                                            <div className="slds-m-top_x-small">
                                                {" "}
                                                Account ID
                                            </div>
                                            <div className="slds-m-top_xxx-small">
                                                {accountId}
                                            </div>
                                            <div className="slds-m-top_x-small">
                                                Sub Domain
                                            </div>
                                            <div className="slds-m-top_xxx-small">
                                                {subDomain}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    &nbsp;
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
                                        label: "Creating Hightouch...",
                                    }}
                                />
                            </div>
                            <div className="slds-float_right slds-m-right_x-small">
                                <form>
                                    {/* <Button id="button">
                                        <Link
                                            to="/CheckApplicationDetails"
                                            onClick={() =>
                                                prop.updateState(
                                                    true,
                                                    false,
                                                    false,
                                                    false
                                                )
                                            }
                                            state={{
                                                client: client,
                                                secret: secret,
                                            }}
                                        >
                                            Back
                                        </Link>
                                    </Button> */}
                                    &nbsp; &nbsp;
                                    <Button
                                        id="button"
                                        disabled={isValid}
                                        variant="brand"
                                        onClick={CreateHightouch}
                                    >
                                        Create
                                    </Button>
                                </form>
                            </div>
                            <div id="foot" className={footerClass}>
                                <div className="slds-notify_container slds-is-relative">
                                    <div
                                        className="slds-notify slds-notify_toast slds-theme_info"
                                        role="status"
                                    >
                                        <span className="slds-assistive-text">
                                            info
                                        </span>
                                        <span
                                            className="slds-icon_container slds-icon-utility-info slds-m-right_small slds-no-flex slds-align-top"
                                            title="Description of icon when needed"
                                        >
                                            <svg
                                                className="slds-icon slds-icon_small"
                                                aria-hidden="true"
                                            >
                                                <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                                            </svg>
                                        </span>
                                        <div className="slds-notify__content">
                                            <h2 className="slds-text-heading_small">
                                                You're almost done connecting
                                                the Salesforce Marketing Cloud
                                                to Hightouch! Please open this
                                                link in a new tab to add it to
                                                your Hightouch workspace. You
                                                must link it to your workspace
                                                in order to complete the
                                                connection.
                                                <a
                                                    target="_blank"
                                                    href={redirectUri}
                                                    onClick={routeChange}
                                                >
                                                    {redirectUri}
                                                </a>
                                            </h2>
                                        </div>
                                        <div className="slds-notify__close">
                                            <Button
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                    setShowSuccess(false);
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
                            <div id="errorfoot" className={errorFooterClass}>
                                <div className="slds-notify_container slds-is-relative">
                                    <div
                                        className="slds-notify slds-notify_toast slds-theme_info"
                                        role="status"
                                    >
                                        <span className="slds-assistive-text">
                                            info
                                        </span>
                                        <span
                                            className="slds-icon_container slds-icon-utility-info slds-m-right_small slds-no-flex slds-align-top"
                                            title="Description of icon when needed"
                                        >
                                            <UtilityIcon
                                                svgClass="slds-icon slds-icon_small"
                                                iconName="info"
                                            />
                                        </span>
                                        <div className="slds-notify__content">
                                            <h2 className="slds-text-heading_small">
                                                Unable to connect the Salesforce
                                                Marketing Cloud to Hightouch!
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
                        </form>
                    </div>
                    <br></br>
                </BrandBand>
            </div>
        </div>
    );
}
export default withNavigation(Review);
