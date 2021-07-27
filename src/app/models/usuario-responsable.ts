export interface UsuarioResponsable {
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
}
