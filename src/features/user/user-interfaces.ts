export interface User {
  id: number;
  nombre: string;
  correo: string;
}

export enum RolUsuario {
  TECNICO = "TECNICO",
  OFICINA = "OFICINA",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  COBRADOR = "COBRADOR",
}

interface UserResponseLogin {
  sub: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
  empresaId: number;
  id: number;
}

export interface ResponseLogin {
  user: UserResponseLogin;
  access_token: string;
}
