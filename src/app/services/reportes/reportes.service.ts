import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  URL_API = 'http://localhost:4000';

  selectedReporte: Reporte = {
    ubicacion: {
      longitud: 0,
      latitud: 0
    },
    tipoProblema: '',
    credibilidad: 0,
    usuarios: [
      {_id: ''}
    ]
  }

  reportes: Reporte[] = [];

  constructor(private http: HttpClient) { }

  createReporte(formData: FormData) {
    console.log("........................................................")

    // this.selectedReporte = formData;

    return this.http.post(this.URL_API + '/nuevo-reporte/', formData);
  }

  replicarReporte() {

  }

  getTipoReportes() {
    return this.http.get<any[]>(this.URL_API + '/reportes-tipo/');
  }

  getReportes() {
    return this.http.get<any[]>(this.URL_API + '/reportes/');
  }

  getReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/reporte/' + _id);
  }

  // editReporte() {
    
  // }

  deleteReporte(_id?: string) {
    return this.http.delete(this.URL_API + '/reporte/' + _id);
  }
}
