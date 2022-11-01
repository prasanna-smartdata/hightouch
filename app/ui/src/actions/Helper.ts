import { RequestSetupBody } from "types"
import { HIGHTOUCH_SETUP_PRIMARY_ID } from "../constants/ApiConstants"

export const getSetupUpsertRequestBody = (s2svalue: boolean, configComplete: boolean) => {
    const collection = [];
    const payLoad: RequestSetupBody = {
        keys: {
            "Hightouch PrimaryId": HIGHTOUCH_SETUP_PRIMARY_ID
        },
        values: {
            "S2S Verify": s2svalue,
            "Config Complete": configComplete

        }
    }

    collection.push(payLoad);
    return collection;
}