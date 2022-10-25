export const getCreateDEPayload = (
    accessToken: string,
    accountId: string,
    deCustomerKey: string,
    deName: string
) => {
    var data = `<?xml version="1.0" encoding="UTF-8"?>
    <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <s:Header>\r\n<a:Action s:mustUnderstand="1">Create</a:Action>
            <a:To s:mustUnderstand="1">https://mcftllc2rwg-b3-r6878b77j8gv4.soap.marketingcloudapis.com/Service.asmx</a:To>
            <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
                <Objects xsi:type="DataExtension">
                    <Client>
                        <ID>${accountId}</ID>
                    </Client>
                    <CustomerKey>${deCustomerKey}</CustomerKey>
                    <Name>${deName}</Name>
                    <Fields>
                        <Field>
                            <CustomerKey>Model</CustomerKey>
                            <Name>Model</Name>
                            <FieldType>Text</FieldType>
                            <MaxLength>500</MaxLength>
                            <IsRequired>true</IsRequired>
                            <IsPrimaryKey>true</IsPrimaryKey>
                        </Field>
                        <Field>
                            <CustomerKey>Schedule</CustomerKey>
                            <Name>Schedule</Name>
                            <FieldType>Text</FieldType>
                            <MaxLength>500</MaxLength>
                        </Field>
                        <Field>
                            <CustomerKey>Status</CustomerKey>
                            <Name>Status</Name>
                            <FieldType>Text</FieldType>
                            <MaxLength>500</MaxLength>
                        </Field>
                        <Field>
                            <CustomerKey>last_run</CustomerKey>
                            <Name>Last Run</Name>
                            <FieldType>Date</FieldType>
                        </Field>
                    </Fields>
                </Objects>
            </CreateRequest>
        </s:Body>
    </s:Envelope>`;

    return data;
};

export const getCheckDEPayload = (
    tssd: string,
    accessToken: string,
    deCustomerKey: string
) => {
    var data = `<?xml version="1.0" encoding="UTF-8"?>
    <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <s:Header>
            <a:Action s:mustUnderstand="1">Retrieve</a:Action>
            <a:To s:mustUnderstand="1">https://${tssd}.soap.marketingcloudapis.com/Service.asmx</a:To>
            <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
                <RetrieveRequest>
                    <ObjectType>DataExtension</ObjectType>
                    <Properties>ObjectID</Properties>
                    <Properties>CustomerKey</Properties>
                    <Properties>Name</Properties>
                    <Filter xsi:type="SimpleFilterPart">
                        <Property>CustomerKey</Property>
                        <SimpleOperator>equals</SimpleOperator>
                        <Value>${deCustomerKey}</Value>
                    </Filter>
                </RetrieveRequest>
            </RetrieveRequestMsg>
        </s:Body>
    </s:Envelope>`;

    return data;
};

export const getDEDataPayload = (
    tssd: string,
    accessToken: string,
    deName: string
) => {

    var data = `<?xml version="1.0" encoding="UTF-8"?>
    <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <s:Header>
            <a:Action s:mustUnderstand="1">Retrieve</a:Action>
            <a:To s:mustUnderstand="1">https://${tssd}.soap.marketingcloudapis.com/Service.asmx</a:To>
            <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </s:Header> 
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
                <RetrieveRequest>
                    <ObjectType>DataExtensionObject[${deName}]</ObjectType>
                    <Properties>Celebrus Connect URL</Properties>
                    <Properties>S2S Verify</Properties>
                    <Properties>Celebrus Connect</Properties>
                    <Properties>Config Complete</Properties>
                </RetrieveRequest>
            </RetrieveRequestMsg>
        </s:Body>
    </s:Envelope>`;


    return data;
};

export const getDEUpdatePayload = (
    tssd: string,
    accessToken: string,
    customerKey: string,
    primaryColumn: string,
    primaryColumnValue: string,
    updateColumnOne: string,
    updateColumnOneValue: string,
    updateColumnTwo: string,
    updateColumnTwoValue: string,
    updateColumnThree: string,
    updateColumnThreeValue: string
) => {
    var data = `<?xml version="1.0" encoding="UTF-8"?>
    <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <s:Header>
            <a:Action s:mustUnderstand="1">Update</a:Action>
            <a:To s:mustUnderstand="1">https://${tssd}.soap.marketingcloudapis.com/Service.asmx</a:To>
            <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <UpdateRequest  xmlns="http://exacttarget.com/wsdl/partnerAPI">
                <Options></Options>
                <Objects xsi:type="DataExtensionObject">
                    <PartnerKey xsi:nil="true"></PartnerKey>
                    <ObjectID xsi:nil="true"></ObjectID>
                    <CustomerKey>${customerKey}</CustomerKey>
                    <Properties>
                        <Property>
                            <Name>${primaryColumn}</Name>
                            <Value>${primaryColumnValue}</Value>
                        </Property>
                        <Property>
                            <Name>${updateColumnOne}</Name>
                            <Value>${updateColumnOneValue}</Value>
                        </Property>
                        </Property>
                        <Property>
                            <Name>${updateColumnTwo}</Name>
                            <Value>${updateColumnTwoValue}</Value>
                        </Property>
                        </Property>
                        <Property> 
                            <Name>${updateColumnThree}</Name>
                            <Value>${updateColumnThreeValue}</Value>
                        </Property>
                    </Properties>
                </Objects>
            </UpdateRequest>
        </s:Body>
    </s:Envelope>`;

    return data;
};
