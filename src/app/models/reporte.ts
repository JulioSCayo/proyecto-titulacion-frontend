export interface Reporte {
    _id?: string;
	estado?: string;
	ubicacion: {
		longitud: number;
		latitud: number;
    }
	tipoProblema: string;
	fechaCreacion?: Date;
	fechaSolucion?: Date;
	credibilidad: number;
	urgenciaTiempo?: number;
	comentario?: string,
	vidaRiesgo?: number,
	asignado?: string,
	cronico?: boolean,
	fantasma?: boolean,
	usuarios: [
        {
            _id?: string;
        }
    ]
    createdAt?: string;
    updatedAt?: string;
}