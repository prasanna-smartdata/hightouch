import { Button, Panel } from "@salesforce/design-system-react";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export const withDashboard = (ChildComponent: any) => {
    return class extends Component {
        render() {
            return (
                <div
                    className="slds-grid "
                    style={{
                        height: "100%",
                    }}
                >
                    <div className="slds-col slds-size_1-of-7">
                        <span>
                            <div
                                style={{
                                    background: "#2e0039",
                                    height: "100%",
                                }}
                            >
                                <div>&nbsp;</div>
                                <nav
                                    className="slds-nav-vertical slds-text-color_inverse "
                                    aria-label="Sub page"
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <div className="slds-nav-vertical__section">
                                        <h5
                                            id="entity-header"
                                            className="slds-text-heading-xx_small slds-m-left--large"
                                        >
                                            <Button id="ht">Ht</Button>
                                            {""} Virtual Querying Data
                                        </h5>
                                        <ul className="slds-m-around--large">
                                            <li>
                                                <Link
                                                    to="#"
                                                    className="slds-text-color_inverse-weak slds-has-blur-focus"
                                                >
                                                    Data Extensions
                                                </Link>
                                            </li>
                                            <li className="slds-m-top--medium slds-m-bottom--medium">
                                                <Link
                                                    to="#"
                                                    className="slds-text-color_inverse-weak slds-has-blur-focus"
                                                >
                                                    Journeys
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="syncsdashboard"
                                                    className="slds-text-color_inverse-weak slds-has-blur-focus"
                                                >
                                                    Hightouch Syncs
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </span>
                    </div>

                    <div className="slds-col slds-size_6-of-7">
                        <span>
                            {" "}
                            <ChildComponent></ChildComponent>
                        </span>
                    </div>
                </div>
            );
        }
    };
};
