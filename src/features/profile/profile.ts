import { RolUsuario } from "../user/user-interfaces";

export interface MediaUrl {
  url: string;
}

export interface UserProfile {
  bio: string;
  telefono: string;
  notificarWhatsApp: boolean;
  notificarPush: boolean;
  notificarSonido: boolean;
  avatar: MediaUrl;
  portada: MediaUrl;
  creadoEn: string | Date;
  actualizadoEn: string | Date;
}

export interface UserProfileResponse {
  id: number;
  empresaId: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: RolUsuario;
  activo: boolean;
  contrasena: string;
  creadoEn: string | Date;
  actualizadoEn: string | Date;
  perfil: UserProfile;
}
