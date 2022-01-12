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

  createReporte(usuario: string, formData: FormData) {
    return this.http.post(this.URL_API + '/nuevo-reporte/' + usuario, formData);
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

  getReportesNoAsignados(nombreUsuario: any) {
    return this.http.get<any[]>(this.URL_API + '/reportes-no-asignados/' + nombreUsuario);
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

  getReportesUsuario(usuario: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-usuario/' + usuario);
  }

  getReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/reporte/' + _id);
  }

  editReporte(reporte: any) {
    return this.http.put(this.URL_API + '/reporte/' + reporte._id, reporte);
  }

  editImagenReporte(id?: string, formData?: FormData) {
    return this.http.put(this.URL_API + '/imagen-reporte/' + id, formData);
  }

  deleteReporte(_id?: string) {
    return this.http.delete(this.URL_API + '/reporte/' + _id);
  }

  getInfoUsuariosReporte(ids: any){
    return this.http.post<any[]>(this.URL_API + '/infoUsuariosReporte/', ids)
  }

  reverseGeocoding(){
    // AIzaSyD8LFh53VddzDev0C6A5Jhln9KgpmpoExg
    // return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&amp;key=AIzaSyC6fYd8wgc8L8L9GDxRZlEUZim4JnhBJh4")
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&amp;key=AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw")
  }
  

}
