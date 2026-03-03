import { createApiClient } from "./createApiClient";
import { createApiHooks } from "./useQueryHooksCrm";

const crmClient = createApiClient(process.env.EXPO_PUBLIC_CRM_API_URL!);

export const crm = createApiHooks(crmClient);
