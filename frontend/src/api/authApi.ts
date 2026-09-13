import { type AccountInfo, type IPublicClientApplication } from "@azure/msal-browser";
import { apiRequest } from "../msalConfig";

export async function getApiAccessToken(
  instance: IPublicClientApplication,
  account: AccountInfo
) {
  const response = await instance.acquireTokenSilent({
    ...apiRequest,
    account,
  });

  return response.accessToken;
}