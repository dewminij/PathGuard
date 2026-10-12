import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "b3724832-3918-47ba-89e7-e5a79072f43a",
    authority: "https://login.microsoftonline.com/5f154e57-d5bf-49a7-8f75-0852df886372",
    redirectUri: "http://localhost:5173",
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const apiRequest = {
  scopes: ["api://b3724832-3918-47ba-89e7-e5a79072f43a/access_as_user"],
};

export const msalInstance = new PublicClientApplication(msalConfig);