import * as apiTypes from "../constants/ApiConstants";
import axios from "axios";
import { AuthRequestBody, RequestSyncBody, RequestWithAccountId } from "types";


const client = axios.create({
    timeout: 20 * 1000,
});

// Call the s2s Api
export async function verifYServer2ServerOAuth(
    authRequest: AuthRequestBody
): Promise<string> {
    let response = "";
    try {
        const resp = await client.post(apiTypes.VERIFFY_S2S_URL, authRequest);
        if (resp.status === 200) {
            response = "valid";
        } else {
            response = "invalid";
        }
    } catch (error) {
        console.log(error);
        response = "invalid";
    }

    return Promise.resolve(response);
}

export async function getUserInfo(): Promise<object> {
    let data = {};
    try {
        const resp = await client.get(apiTypes.GET_USER_INFO_URL);
        data = resp.data;
    } catch (error) {
        console.log(error);
    }

    return Promise.resolve(data);
}
export async function checkDataExtension() {
    let isFound = false;
    try {
        const resp = await client.get(apiTypes.CHECK_DE_EXTENSION);
        if (resp) {
            if (resp.status === 200) {
                isFound = true;
            }
            else
                isFound = false;
        }


    } catch (error) {
        console.log(error);
        return isFound;

    }

    return isFound;
}

//Calling the get DE data server call
export async function getDataExtensionData() {
    try {
        const resp = await client.get(apiTypes.GET_DE_EXTENSION);

        if (resp) {
            return resp;
        }


    } catch (error) {
        console.log(error);

    }

}
//Calling create DE server call
export async function createDataExtension(request: RequestWithAccountId): Promise<boolean> {
    try {
        const resp = await client.post(apiTypes.CREATE_DE_EXTENSION, request);
        if (resp) {
            return true;
        }

    } catch (error) {
        console.log(error);
        return Promise.resolve(false)

    }
    return true;
}

//Calling insert and upsert data on DE server call
export async function upsertDataExtension(request: RequestSyncBody[]): Promise<boolean> {
    try {
        const resp = await client.post(apiTypes.UPSERT_DE_EXTENSION, request);
        if (resp) {
            return true;
        }

    } catch (error) {
        console.log(error);
        return Promise.resolve(false)

    }
    return true;
}

//Calling the hightouch api
export async function connectToHightouch(
    authRequest: AuthRequestBody
): Promise<object> {
    let data = {};
    try {
        const resp = await client.post(
            apiTypes.CONNECT_HIGHTOUCH_URL,
            authRequest
        );
        if (resp.status === 200) {
            data = resp.data;
        }
    } catch (error) {
        console.log(error);
    }

    return Promise.resolve(data);
}

//Construct the syncs object array
export async function getSyncs() {
    try {
        //Read the destinations of type "sfmc"
        const destinations = await getHightouchDestinations();

        //Read the syncs
        const syncs = await getHightouchSyncs();
        //Step 1) Get all destinations of type "sfmc"
        //Step 2) Get all syncs 
        // Filter these two arrays using the destination
        let resultData = syncs.filter((el: any) => {
            return destinations.find((element: any) => {
                return element.id === el.destinationId;
            });
        });
        return resultData;

    } catch (error) {
        return [];
    }
}
//Calling the get hightouch destinations call
async function getHightouchDestinations() {
    try {
        const resp = await client.get(apiTypes.GET_DESTINATIONS);

        return resp.data;

    } catch (error) {
        console.log(error);
        return [];

    }

}

//Calling the get hightouch syncs call
async function getHightouchSyncs() {
    try {
        const resp = await client.get(apiTypes.GET_DESTINATION_SYNCS);
        if (resp) {
            return resp.data;
        }


    } catch (error) {
        console.log(error);

    }

}
