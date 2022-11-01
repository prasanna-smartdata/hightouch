import { createContext, useState } from "react";
import { ISetupStatus } from "types";

const pageStatusValue: ISetupStatus = {
    primaryKey: '',
    isS2SCompleted: false,
    isConfigCompleted: false
};

export const NavigationContext = createContext({
    isAppDetialsPath: true,
    isSetupPath: false,
    isAppDetialsDone: false,
    isSetupDone: false,
    setupStatus: pageStatusValue,
    updateState: (
        isApp: boolean,
        isSetup: boolean,
        isAppDetailsDone: boolean,
        isSetupDone: boolean
    ) => { },
    updateSetupState: (pageStatus: ISetupStatus) => { },

});

export const NavigationProvider = ({ children }: any) => {
    const [isAppDetialsPath, setIsAppDetialsPath] = useState(true);
    const [isSetupPath, setIsSetupPath] = useState(false);
    const [isAppDetialsDone, setIsAppDetialsDone] = useState(false);
    const [isSetupDone, setIsSetupDone] = useState(false);
    const [setupStatus, setSetupStatus] = useState({
        primaryKey: '',
        isS2SCompleted: false,
        isConfigCompleted: false
    });
    const [userInfo, setUserInfo] = useState({
        userId: "",
        accountId: "",
        email: ""
    });
    const updateSetupState = (pageStatus: ISetupStatus) => {
        setSetupStatus(pageStatus);

    };

    const updateState = (
        isApp: boolean,
        isSetup: boolean,
        isAppDetailsDone: boolean,
        isSetupDone: boolean
    ) => {
        setIsAppDetialsPath(isApp);
        setIsSetupPath(isSetup);
        setIsAppDetialsDone(isAppDetailsDone);
        setIsSetupDone(isSetupDone);
    };
    return (
        <NavigationContext.Provider
            value={{
                isAppDetialsPath,
                isSetupPath,
                isAppDetialsDone,
                isSetupDone,
                setupStatus,
                updateSetupState,
                updateState,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
