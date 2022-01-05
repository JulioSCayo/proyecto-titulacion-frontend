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
    return this.http.post(this.URL_API + '/nuevo-reporte/', formData);
  }

  replicarReporte(_id?: string, formData?: FormData) {
    return this.http.put<any>(this.URL_API + '/replicar-reporte/' + _id, formData);
  }

  reasignarReporte(_id?: string, tipoProblema?: string) {
    return this.http.get<any>(this.URL_API + '/reasignar-reporte/' + _id + "$" + tipoProblema);
  }

  refuerzoReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/refuerzo-reporte/' + _id);
  }

  getTipoReportes(tipo: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-tipo/' + tipo);
  }

  getEstadoReportes(estado: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-estado/' + estado);
  }

  getReportesNoAsignados() {
    return this.http.get<any[]>(this.URL_API + '/reportes-no-asignados/');
  }

  getReporteAsignado() {
    let id = localStorage.getItem("IDU");
    return this.http.get<any>(this.URL_API + '/reporte-asignado/' +  id);
  }

  getReportes() {
    return this.http.get<any[]>(this.URL_API + '/reportes/');
  }

  getReportesSegunUsr(institucion: string){
    return this.http.get<any[]>(this.URL_API + '/reportes/');
  }

  getReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/reporte/' + _id);
  }

  editReporte(reporte: Reporte) {
    return this.http.put(this.URL_API + '/reporte/' + reporte._id, reporte);
  }

  deleteReporte(_id?: string) {
    return this.http.delete(this.URL_API + '/reporte/' + _id);
  }
}
