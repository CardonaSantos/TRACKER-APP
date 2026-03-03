import { ResponseLogin } from "@/features/user/user-interfaces";
import { crmEndpoints } from "../endpoints";
import { crm } from "../hook-base/crmApi";

interface LoginDto {
  correo: string;
  contrasena: string;
}

export function useLogin() {
  return crm.useMutationApi<ResponseLogin, LoginDto>(
    "post",
    crmEndpoints.auth.login,
  );
}
