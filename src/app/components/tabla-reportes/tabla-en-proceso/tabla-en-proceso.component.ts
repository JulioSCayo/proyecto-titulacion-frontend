import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import Swal from 'sweetalert2';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';

@Component({
  selector: 'app-tabla-en-proceso',
  templateUrl: './tabla-en-proceso.component.html',
  styleUrls: ['./tabla-en-proceso.component.css']
})
export class TablaEnProcesoComponent implements OnInit {

  reportes: Reporte[] = [{
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
      _id: ""
    }]
  }];

  busqueda = ""; // Pipe

  constructor(public reportesService: ReportesService) { }

  ngOnInit(): void {
    this.getReportes();
  }

  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "En proceso$"+ localStorage.getItem("Usr");
    
    this.reportesService.getEstadoReportes(estado).subscribe(
      async res => {
          this.reportes = <Reporte[]>res;

          for(let reporte of this.reportes) {
            console.log(reporte);
          }
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );
  }

  cambioSolucionado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Solucionado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let hoy = new Date(Date.now());
        reporte.fechaSolucion = hoy;
        reporte.estado = "Solucionado";
        
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'Solucionado!',
              text: "Se cambió el estado del reporte a 'Solucionado'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "En proceso";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }

  cambioDenegado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Denegado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reporte.estado = "Denegado";
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'Denegado!',
              text: "Se cambió el estado del reporte a 'Denegado'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "Desatendido";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }
}
