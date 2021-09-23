export interface Reporte {
    _id?: string;
    folio?: string;
	estado?: string;
	ubicacion: {
		longitud: number;
		latitud: number;
    }
	tipoProblema: string;
	fechaCreacion?: Date;
	fechaSolucion?: Date;
	credibilidad: number;
	urgencia?: number;
	usuarios: [
        {
            _id?: string;
        }
    ]
    createdAt?: string;
    updatedAt?: string;
}