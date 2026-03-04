import { UserProfileResponse } from "@/features/profile/profile";
import { crmEndpoints } from "../endpoints";
import { crm } from "../hook-base/crmApi";
import { UserQkeys } from "./Qk";

export function useGetProfileUser(userId: number | undefined) {
  return crm.useQueryApi<UserProfileResponse>(
    UserQkeys.all,
    crmEndpoints.profile.byId(userId!),
    undefined,
    {
      enabled: !!userId,
    },
  );
}
