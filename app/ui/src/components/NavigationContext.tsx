import { createContext, useState } from "react";

export const NavigationContext = createContext({
    isAppDetialsPath: true,
    isSetupPath: false,
    isAppDetialsDone: false,
    isSetupDone: false,
    updateState: (
        sApp: boolean,
        isSetup: boolean,
        isAppDetailsDone: boolean,
        isSetupDone: boolean
    ) => { },
});

export const NavigationProvider = ({ children }: any) => {
    const [isAppDetialsPath, setIsAppDetialsPath] = useState(true);
    const [isSetupPath, setIsSetupPath] = useState(false);
    const [isAppDetialsDone, setIsAppDetialsDone] = useState(false);
    const [isSetupDone, setIsSetupDone] = useState(false);

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
                updateState,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
