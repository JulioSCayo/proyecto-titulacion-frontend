export interface UsuarioResponsable {
    _id?: string;
    institucion: string,
    nombreUsuario: string,
    contrasena?: string,
    reporteAsignado?: {
        folio?: string,
        tipoProblema?: string,
        urgencia?: Number,
        fechaCreacion?: Date,
        estado?: string,
        ubicacion?: {
            longitud?: Number,
            latitud?: Number
        }
    }
    createdAt?: string;
    updatedAt?: string;
}
