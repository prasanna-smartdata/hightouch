import classNames from "classnames";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UtilityIcon } from "./icons/UtilityIcon";
import { withNavigation } from "./withNavigation";

const Header = (prop: any) => {
    const location = useLocation();

    const { isAppDetialsPath, isSetupPath, isAppDetialsDone, isSetupDone } =
        prop;

    useEffect(() => {
        switch (location.pathname) {
            case "/":
            case "/CheckApplicationDetails":
                prop.updateState(true, false, false, false);
                break;
            case "/ReviewSetup":
                prop.updateState(false, true, true, false);
                break;
            default:
                break;
        }
    }, []);

    const navigationAppDetailsClass = classNames({
        "slds-path__item": true,
        "btn-slds-is-current slds-is-active":
            !isAppDetialsDone && isAppDetialsPath,
        "slds-is-incomplete": !isAppDetialsPath,
        "slds-is-complete": isAppDetialsDone,
    });

    const navigationSetupClass = classNames({
        "slds-path__item": true,
        "btn-slds-is-current slds-is-active": !isSetupDone && isSetupPath,
        "slds-is-incomplete": !isSetupPath,
        "slds-is-complete": isSetupDone,
    });

    return (
        <div className="slds-path slds-m-top_medium slds-m-bottom_medium  slds-m-left_medium  slds-m-right_medium">
            <div className="slds-grid slds-path__track">
                <div className="slds-grid slds-path__scroller-container">
                    <div className="slds-path__scroller">
                        <div className="slds-path__scroller_inner">
                            <ul
                                className="slds-path__nav"
                                role="listbox"
                                aria-orientation="horizontal"
                            >
                                <li
                                    className={navigationAppDetailsClass}
                                    role="presentation"
                                >
                                    <a
                                        aria-selected="true"
                                        className="slds-path__link"
                                        id="path-1"
                                        role="option"
                                    >
                                        <span className="slds-path__stage">
                                            <UtilityIcon
                                                svgClass="slds-icon slds-icon_x-small"
                                                iconName="check"
                                            />
                                            <span className="slds-assistive-text">
                                                Current Stage:
                                            </span>
                                        </span>
                                        <span className="slds-path__title">
                                            S2S Application Setup
                                        </span>
                                    </a>
                                </li>

                                <li
                                    className={navigationSetupClass}
                                    role="presentation"
                                >
                                    <a
                                        aria-selected="false"
                                        className="slds-path__link"
                                        id="path-3"
                                        role="option"
                                    >
                                        <span className="slds-path__stage">
                                            <UtilityIcon
                                                svgClass="slds-icon slds-icon_x-small"
                                                iconName="check"
                                            />
                                        </span>
                                        <span className="slds-path__title">
                                            Review Setup
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withNavigation(Header);
