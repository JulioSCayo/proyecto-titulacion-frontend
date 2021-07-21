export interface UsuarioEspecial {
	_id?: string;
    nombre: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	correoElectronico: string;
	nombreUsuario: string;
	contrasena: string;
	reputacion?: number;
	imagen?: File;
	validado?: boolean;
    createdAt?: string;
    updatedAt?: string;
}